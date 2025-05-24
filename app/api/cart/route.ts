import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const db = getDatabase()
    
    const cartItems = db.prepare(`
      SELECT 
        ci.*,
        p.name,
        p.price,
        p.crypto_price,
        p.image_url,
        p.in_stock,
        p.discount_percentage,
        c.name as category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(user.id) as any[]
    
    const formattedItems = cartItems.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      price: item.price,
      cryptoPrice: item.crypto_price,
      quantity: item.quantity,
      selectedSize: item.selected_size,
      selectedColor: item.selected_color,
      imageUrl: item.image_url,
      inStock: item.in_stock,
      discountPercentage: item.discount_percentage,
      category: item.category_name,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
    
    // Calculate totals
    const subtotal = formattedItems.reduce((sum, item) => {
      const itemPrice = item.discountPercentage > 0 
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price
      return sum + (itemPrice * item.quantity)
    }, 0)
    
    const cryptoSubtotal = formattedItems.reduce((sum, item) => {
      const itemPrice = item.discountPercentage > 0 
        ? item.cryptoPrice * (1 - item.discountPercentage / 100)
        : item.cryptoPrice
      return sum + (itemPrice * item.quantity)
    }, 0)
    
    const shipping = 4.99
    const cryptoShipping = 0.0025
    
    return successResponse({
      items: formattedItems,
      summary: {
        itemCount: formattedItems.length,
        totalQuantity: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Number(subtotal.toFixed(2)),
        shipping,
        total: Number((subtotal + shipping).toFixed(2)),
        cryptoSubtotal: Number(cryptoSubtotal.toFixed(8)),
        cryptoShipping,
        cryptoTotal: Number((cryptoSubtotal + cryptoShipping).toFixed(8))
      }
    })
    
  } catch (error: any) {
    console.error('Get cart error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to fetch cart', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const db = getDatabase()
    
    // Clear all cart items for user
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id)
    
    return successResponse(null, 'Cart cleared successfully')
    
  } catch (error: any) {
    console.error('Clear cart error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to clear cart', 500)
  }
}