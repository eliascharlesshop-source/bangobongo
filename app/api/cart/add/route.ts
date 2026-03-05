import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/api-response'

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive').default(1),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    // Validate input
    const validation = addToCartSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const { productId, quantity, selectedSize, selectedColor } = validation.data
    const db = getDatabase()

    // Check if product exists and is in stock
    const product = db.prepare(`
      SELECT id, name, price, crypto_price, in_stock, sizes, colors
      FROM products 
      WHERE id = ?
    `).get(productId) as any

    if (!product) {
      return notFoundResponse()
    }

    if (!product.in_stock) {
      return errorResponse('Product is out of stock', 400)
    }

    // Validate size and color if provided
    if (selectedSize && product.sizes) {
      const availableSizes = JSON.parse(product.sizes)
      if (!availableSizes.includes(selectedSize)) {
        return errorResponse('Invalid size selected', 400)
      }
    }

    if (selectedColor && product.colors) {
      const availableColors = JSON.parse(product.colors)
      if (!availableColors.includes(selectedColor)) {
        return errorResponse('Invalid color selected', 400)
      }
    }

    const { v4: uuidv4 } = require('uuid')

    // Check if item already exists in cart
    const existingItem = db.prepare(`
      SELECT id, quantity 
      FROM cart_items 
      WHERE user_id = ? AND product_id = ? AND selected_size = ? AND selected_color = ?
    `).get(user.id, productId, selectedSize || null, selectedColor || null) as any

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      db.prepare(`
        UPDATE cart_items 
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newQuantity, existingItem.id)

      const cartItemId = existingItem.id

      // Get updated cart item
      const updatedItem = db.prepare(`
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
        WHERE ci.id = ?
      `).get(cartItemId) as any

      return successResponse({
        id: updatedItem.id,
        productId: updatedItem.product_id,
        name: updatedItem.name,
        price: updatedItem.price,
        cryptoPrice: updatedItem.crypto_price,
        quantity: updatedItem.quantity,
        selectedSize: updatedItem.selected_size,
        selectedColor: updatedItem.selected_color,
        imageUrl: updatedItem.image_url,
        inStock: updatedItem.in_stock,
        discountPercentage: updatedItem.discount_percentage
      }, 'Cart updated successfully')
    } else {
      // Add new item
      const cartItemId = uuidv4()

      db.prepare(`
        INSERT INTO cart_items (id, user_id, product_id, quantity, selected_size, selected_color)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(cartItemId, user.id, productId, quantity, selectedSize || null, selectedColor || null)

      // Get created cart item
      const newItem = db.prepare(`
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
        WHERE ci.id = ?
      `).get(cartItemId) as any

      return successResponse({
        id: newItem.id,
        productId: newItem.product_id,
        name: newItem.name,
        price: newItem.price,
        cryptoPrice: newItem.crypto_price,
        quantity: newItem.quantity,
        selectedSize: newItem.selected_size,
        selectedColor: newItem.selected_color,
        imageUrl: newItem.image_url,
        inStock: newItem.in_stock,
        discountPercentage: newItem.discount_percentage
      }, 'Item added to cart successfully')
    }

  } catch (error: any) {
    console.error('Add to cart error:', error)

    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }

    return errorResponse('Failed to add item to cart', 500)
  }
}