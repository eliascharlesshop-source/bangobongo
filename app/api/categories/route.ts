import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db/index-with-sqlite'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const db = getDatabase()

    let query = 'SELECT * FROM categories WHERE 1=1'
    const params: any[] = []

    if (active === 'true') {
      query += ' AND is_active = 1'
    } else if (active === 'false') {
      query += ' AND is_active = 0'
    }

    query += ' ORDER BY name ASC'

    const categories = db.prepare(query).all(...params) as any[]

    return successResponse({ categories })

  } catch (error: any) {
    console.error('Get categories error:', error)
    return errorResponse('Failed to fetch categories', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validation = createCategorySchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const { v4: uuidv4 } = require('uuid')
    const categoryId = uuidv4()

    const db = getDatabase()

    // Check if slug already exists
    const existingCategory = db.prepare('SELECT id FROM categories WHERE slug = ?').get(data.slug)
    if (existingCategory) {
      return errorResponse('Category slug already exists', 409)
    }

    // Insert category
    db.prepare(`
      INSERT INTO categories (id, name, slug, description, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      categoryId,
      data.name,
      data.slug,
      data.description || null,
      data.imageUrl || null,
      data.isActive
    )

    // Get the created category
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as any

    return successResponse(category, 'Category created successfully')

  } catch (error: any) {
    console.error('Create category error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to create category', 500)
  }
}