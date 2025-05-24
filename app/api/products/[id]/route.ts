import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response'

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  cryptoPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  relatedAlbum: z.string().optional(),
  relatedTour: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase()
    
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(params.id) as any
    
    if (!product) {
      return notFoundResponse()
    }
    
    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      }
    }
    
    return successResponse(formattedProduct)
    
  } catch (error: any) {
    console.error('Get product error:', error)
    return errorResponse('Failed to fetch product', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin access
    await requireAdmin(request)
    
    const body = await request.json()
    
    // Validate input
    const validation = updateProductSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }
    
    const data = validation.data
    const db = getDatabase()
    
    // Check if product exists
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(params.id)
    if (!existingProduct) {
      return notFoundResponse()
    }
    
    // Build update query
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        
        if (['images', 'sizes', 'colors', 'tags'].includes(key)) {
          updateFields.push(`${dbField} = ?`)
          updateValues.push(JSON.stringify(value))
        } else {
          updateFields.push(`${dbField} = ?`)
          updateValues.push(value)
        }
      }
    })
    
    if (updateFields.length === 0) {
      return errorResponse('No fields to update', 400)
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(params.id)
    
    // Update product
    db.prepare(`
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `).run(...updateValues)
    
    // Get updated product
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(params.id) as any
    
    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      }
    }
    
    return successResponse(formattedProduct, 'Product updated successfully')
    
  } catch (error: any) {
    console.error('Update product error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse('Failed to update product', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin access
    await requireAdmin(request)
    
    const db = getDatabase()
    
    // Check if product exists
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(params.id)
    if (!existingProduct) {
      return notFoundResponse()
    }
    
    // Delete product
    db.prepare('DELETE FROM products WHERE id = ?').run(params.id)
    
    return successResponse(null, 'Product deleted successfully')
    
  } catch (error: any) {
    console.error('Delete product error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse('Failed to delete product', 500)
  }
}