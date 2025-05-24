import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, notFoundResponse } from '@/lib/api-response'

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive')
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    // Validate input
    const validation = updateCartItemSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }
    
    const { quantity } = validation.data
    const db = getDatabase()
    
    // Check if cart item exists and belongs to user
    const cartItem = db.prepare(`
      SELECT id FROM cart_items 
      WHERE id = ? AND user_id = ?
    `).get(params.id, user.id)
    
    if (!cartItem) {
      return notFoundResponse()
    }
    
    // Update quantity
    db.prepare(`
      UPDATE cart_items 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(quantity, params.id)
    
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
    `).get(params.id) as any
    
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
    }, 'Cart item updated successfully')
    
  } catch (error: any) {
    console.error('Update cart item error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to update cart item', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const db = getDatabase()
    
    // Check if cart item exists and belongs to user
    const cartItem = db.prepare(`
      SELECT id FROM cart_items 
      WHERE id = ? AND user_id = ?
    `).get(params.id, user.id)
    
    if (!cartItem) {
      return notFoundResponse()
    }
    
    // Delete cart item
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(params.id)
    
    return successResponse(null, 'Item removed from cart successfully')
    
  } catch (error: any) {
    console.error('Remove cart item error:', error)
    
    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to remove cart item', 500)
  }
}