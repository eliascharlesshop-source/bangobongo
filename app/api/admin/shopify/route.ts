import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

// Shopify Admin API configuration
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-01'

if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.warn('Shopify Admin API configuration missing.')
}

const createProductSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  body_html: z.string().optional(),
  vendor: z.string().default('BangoBongo'),
  product_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    option1: z.string().optional(),
    option2: z.string().optional(),
    option3: z.string().optional(),
    price: z.string(),
    compare_at_price: z.string().optional(),
    sku: z.string().optional(),
    inventory_quantity: z.number().optional(),
    inventory_management: z.string().optional(),
    fulfillment_service: z.string().default('manual'),
    inventory_policy: z.string().default('deny'),
    requires_shipping: z.boolean().default(true),
    taxable: z.boolean().default(true),
    weight: z.number().optional(),
    weight_unit: z.string().optional()
  })).optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).optional(),
  images: z.array(z.object({
    src: z.string().url(),
    alt: z.string().optional()
  })).optional(),
  status: z.enum(['active', 'archived', 'draft']).default('active')
})

async function shopifyAdminRequest(endpoint: string, method: string = 'GET', data?: any) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
    throw new Error('Shopify Admin API not configured')
  }

  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Shopify Admin API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

// GET: List all products from Shopify
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    const page_info = searchParams.get('page_info')
    const status = searchParams.get('status') || 'active'

    let endpoint = `products.json?limit=${limit}&status=${status}`
    if (page_info) {
      endpoint += `&page_info=${page_info}`
    }

    const data = await shopifyAdminRequest(endpoint)
    
    return successResponse({
      products: data.products,
      count: data.products.length
    })

  } catch (error: any) {
    console.error('Shopify Admin API error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    if (error.message.includes('Shopify Admin API not configured')) {
      return errorResponse('Shopify Admin API not configured. Please add SHOPIFY_ADMIN_ACCESS_TOKEN to your environment.', 500)
    }
    
    return errorResponse(`Failed to fetch Shopify products: ${error.message}`, 500)
  }
}

// POST: Create new product in Shopify
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    
    // Validate input
    const validation = createProductSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return validationErrorResponse(errors)
    }

    const productData = validation.data

    // Create product in Shopify
    const shopifyProduct = {
      product: {
        title: productData.title,
        body_html: productData.body_html || '',
        vendor: productData.vendor,
        product_type: productData.product_type || 'Merchandise',
        tags: productData.tags?.join(', ') || '',
        status: productData.status,
        variants: productData.variants || [{
          option1: 'Default Title',
          price: '0.00',
          inventory_quantity: 1,
          inventory_management: 'shopify',
          fulfillment_service: 'manual',
          inventory_policy: 'deny'
        }],
        options: productData.options || [],
        images: productData.images || []
      }
    }

    const result = await shopifyAdminRequest('products.json', 'POST', shopifyProduct)
    
    return successResponse(result.product, 'Product created successfully in Shopify')

  } catch (error: any) {
    console.error('Create Shopify product error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse(`Failed to create Shopify product: ${error.message}`, 500)
  }
}

// PUT: Update existing product in Shopify
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { productId, ...productData } = body

    if (!productId) {
      return errorResponse('Product ID is required for updates', 400)
    }

    // Validate input
    const validation = createProductSchema.partial().safeParse(productData)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return validationErrorResponse(errors)
    }

    const updates = validation.data

    // Update product in Shopify
    const shopifyProduct = {
      product: {
        id: productId,
        ...updates,
        tags: updates.tags?.join(', ')
      }
    }

    const result = await shopifyAdminRequest(`products/${productId}.json`, 'PUT', shopifyProduct)
    
    return successResponse(result.product, 'Product updated successfully in Shopify')

  } catch (error: any) {
    console.error('Update Shopify product error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse(`Failed to update Shopify product: ${error.message}`, 500)
  }
}

// DELETE: Delete product from Shopify
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return errorResponse('Product ID is required', 400)
    }

    await shopifyAdminRequest(`products/${productId}.json`, 'DELETE')
    
    return successResponse({ deleted: true }, 'Product deleted successfully from Shopify')

  } catch (error: any) {
    console.error('Delete Shopify product error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403)
    }
    
    return errorResponse(`Failed to delete Shopify product: ${error.message}`, 500)
  }
}
