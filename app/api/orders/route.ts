import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createOrderSchema = z.object({
  paymentMethod: z.enum(['stripe', 'crypto']),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required')
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required')
  }).optional(),
  stripePaymentIntentId: z.string().optional(),
  cryptoTransactionHash: z.string().optional(),
  cryptoWalletAddress: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const db = getDatabase()
    
    // Get user's orders
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(user.id, limit, offset) as any[]
    
    // Get total count
    const totalCount = db.prepare(`
      SELECT COUNT(*) as count FROM orders WHERE user_id = ?
    `).get(user.id) as { count: number }
    
    // Get order items for each order
    const formattedOrders = orders.map(order => {
      const items = db.prepare(`
        SELECT 
          oi.*,
          p.name,
          p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id) as any[]
      
      return {
        ...order,
        shippingAddress: JSON.parse(order.shipping_address),
        billingAddress: order.billing_address ? JSON.parse(order.billing_address) : null,
        items: items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          price: item.price,
          cryptoPrice: item.crypto_price,
          quantity: item.quantity,
          selectedSize: item.selected_size,
          selectedColor: item.selected_color,
          imageUrl: item.image_url
        }))
      }
    })
    
    return successResponse({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    })
    
  } catch (error: any) {
    console.error('Get orders error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to fetch orders', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    // Validate input
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }
    
    const data = validation.data
    const db = getDatabase()
    
    // Get cart items
    const cartItems = db.prepare(`
      SELECT 
        ci.*,
        p.name,
        p.price,
        p.crypto_price,
        p.image_url,
        p.in_stock,
        p.discount_percentage
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(user.id) as any[]
    
    if (cartItems.length === 0) {
      return errorResponse('Cart is empty', 400)
    }
    
    // Check stock availability
    for (const item of cartItems) {
      if (!item.in_stock) {
        return errorResponse(`Product "${item.name}" is out of stock`, 400)
      }
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const itemPrice = item.discount_percentage > 0 
        ? item.price * (1 - item.discount_percentage / 100)
        : item.price
      return sum + (itemPrice * item.quantity)
    }, 0)
    
    const cryptoSubtotal = cartItems.reduce((sum, item) => {
      const itemPrice = item.discount_percentage > 0 
        ? item.crypto_price * (1 - item.discount_percentage / 100)
        : item.crypto_price
      return sum + (itemPrice * item.quantity)
    }, 0)
    
    const shipping = 4.99
    const cryptoShipping = 0.0025
    const total = subtotal + shipping
    const cryptoTotal = cryptoSubtotal + cryptoShipping
    
    const { v4: uuidv4 } = require('uuid')
    const orderId = uuidv4()
    
    // Create order
    db.prepare(`
      INSERT INTO orders (
        id, user_id, status, payment_method, payment_status,
        subtotal, shipping, total, crypto_subtotal, crypto_shipping, crypto_total,
        shipping_address, billing_address,
        stripe_payment_intent_id, crypto_transaction_hash, crypto_wallet_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      user.id,
      'pending',
      data.paymentMethod,
      'pending',
      subtotal,
      shipping,
      total,
      cryptoSubtotal,
      cryptoShipping,
      cryptoTotal,
      JSON.stringify(data.shippingAddress),
      data.billingAddress ? JSON.stringify(data.billingAddress) : null,
      data.stripePaymentIntentId || null,
      data.cryptoTransactionHash || null,
      data.cryptoWalletAddress || null
    )
    
    // Create order items
    for (const item of cartItems) {
      const orderItemId = uuidv4()
      const itemPrice = item.discount_percentage > 0 
        ? item.price * (1 - item.discount_percentage / 100)
        : item.price
      const itemCryptoPrice = item.discount_percentage > 0 
        ? item.crypto_price * (1 - item.discount_percentage / 100)
        : item.crypto_price
      
      db.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, quantity, price, crypto_price,
          selected_size, selected_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderItemId,
        orderId,
        item.product_id,
        item.quantity,
        itemPrice,
        itemCryptoPrice,
        item.selected_size,
        item.selected_color
      )
    }
    
    // Clear cart
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id)
    
    // Get created order with items
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any
    const orderItems = db.prepare(`
      SELECT 
        oi.*,
        p.name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId) as any[]
    
    const formattedOrder = {
      ...order,
      shippingAddress: JSON.parse(order.shipping_address),
      billingAddress: order.billing_address ? JSON.parse(order.billing_address) : null,
      items: orderItems.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        price: item.price,
        cryptoPrice: item.crypto_price,
        quantity: item.quantity,
        selectedSize: item.selected_size,
        selectedColor: item.selected_color,
        imageUrl: item.image_url
      }))
    }
    
    return successResponse(formattedOrder, 'Order created successfully')
    
  } catch (error: any) {
    console.error('Create order error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to create order', 500)
  }
}