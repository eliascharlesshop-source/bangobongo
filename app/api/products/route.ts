import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cryptoPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isLimited: z.boolean().default(false),
  discountPercentage: z.number().min(0).max(100).default(0),
  relatedAlbum: z.string().optional(),
  relatedTour: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useLocal = searchParams.get('local') === 'true'

    // If explicitly requesting local products or if Shopify is not configured
    if (useLocal) {
      return getLocalProducts(request)
    }

    // Try Shopify first, fallback to local if it fails
    try {
      const shopifyUrl = new URL('/api/shopify/products', request.url)
      // Forward all search params to Shopify API
      searchParams.forEach((value, key) => {
        if (key !== 'local') {
          shopifyUrl.searchParams.set(key, value)
        }
      })

      const shopifyResponse = await fetch(shopifyUrl.toString())

      if (shopifyResponse.ok) {
        const shopifyData = await shopifyResponse.json()
        return Response.json(shopifyData)
      } else {
        console.warn('Shopify API failed, falling back to local products')
        return getLocalProducts(request)
      }
    } catch (error) {
      console.warn('Shopify fetch failed, falling back to local products:', error)
      return getLocalProducts(request)
    }

  } catch (error: any) {
    console.error('Get products error:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}

async function getLocalProducts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limited = searchParams.get('limited')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let db
    try {
      db = getDatabase()
    } catch (dbError) {
      // Database not available - return empty products instead of error
      console.warn('Database not available, returning empty products:', dbError)
      return successResponse({
        products: [],
        source: 'local',
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      })
    }

    // Build query
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (category) {
      query += ' AND (c.slug = ? OR p.category_id = ?)'
      params.push(category, category)
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = 1'
    }

    if (limited === 'true') {
      query += ' AND p.is_limited = 1'
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Get total count
    const countQuery = query.replace('SELECT p.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(*) as count')
    const totalCount = db.prepare(countQuery).get(...params) as { count: number }

    // Add pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const products = db.prepare(query).all(...params) as any[]

    // Parse JSON fields
    const formattedProducts = products.map(product => ({
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
    }))

    return successResponse({
      products: formattedProducts,
      source: 'local',
      pagination: {
        page,
        limit,
        total: totalCount.count,
        pages: Math.ceil(totalCount.count / limit)
      }
    })

  } catch (error: any) {
    console.error('Get local products error:', error)
    return errorResponse('Failed to fetch local products', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request)

    const body = await request.json()

    // Validate input
    const validation = createProductSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const data = validation.data
    const { v4: uuidv4 } = require('uuid')
    const productId = uuidv4()

    const db = getDatabase()

    // Insert product
    db.prepare(`
      INSERT INTO products (
        id, name, description, price, crypto_price, category_id, image_url,
        images, sizes, colors, tags, in_stock, is_featured, is_limited,
        discount_percentage, related_album, related_tour
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId,
      data.name,
      data.description || null,
      data.price,
      data.cryptoPrice || null,
      data.categoryId,
      data.imageUrl || null,
      data.images ? JSON.stringify(data.images) : null,
      data.sizes ? JSON.stringify(data.sizes) : null,
      data.colors ? JSON.stringify(data.colors) : null,
      data.tags ? JSON.stringify(data.tags) : null,
      data.inStock,
      data.isFeatured,
      data.isLimited,
      data.discountPercentage,
      data.relatedAlbum || null,
      data.relatedTour || null
    )

    // Get the created product
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(productId) as any

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

    return successResponse(formattedProduct, 'Product created successfully')

  } catch (error: any) {
    console.error('Create product error:', error)

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }

    return errorResponse('Failed to create product', 500)
  }
}