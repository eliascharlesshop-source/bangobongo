import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'

// Shopify Storefront API configuration
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-01'

if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn('Shopify configuration missing. Using fallback product data.')
}

// Fallback products for demo when Shopify is not configured - removed
const fallbackProducts: any[] = []

// Old demo data removed - configure Shopify integration to display products
]

// Shopify GraphQL query
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          tags
          productType
          vendor
          availableForSale
          totalInventory
        }
      }
    }
  }
`

async function fetchFromShopify(query: string, variables: any = {}) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return null
  }

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    return data.data
  } catch (error) {
    console.error('Shopify API error:', error)
    return null
  }
}

function transformShopifyProduct(shopifyProduct: any) {
  const product = shopifyProduct.node

  return {
    id: product.handle,
    name: product.title,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    cryptoPrice: parseFloat(product.priceRange.minVariantPrice.amount) * 0.000013, // Approximate BTC conversion
    description: product.description,
    category: product.productType || 'Merchandise',
    imageUrl: product.images.edges[0]?.node.url || '/placeholder.jpg',
    images: product.images.edges.map((edge: any) => edge.node.url),
    sizes: product.variants.edges
      .map((edge: any) => edge.node.selectedOptions.find((opt: any) => opt.name === 'Size')?.value)
      .filter((size: any) => size),
    colors: product.variants.edges
      .map((edge: any) => edge.node.selectedOptions.find((opt: any) => opt.name === 'Color')?.value)
      .filter((color: any) => color),
    tags: product.tags,
    inStock: product.availableForSale,
    isFeatured: product.tags.includes('featured'),
    isLimited: product.tags.includes('limited-edition'),
    discountPercentage: product.tags.includes('sale') ? 15 : 0,
    inventory: product.totalInventory || 0,
    shopifyId: product.id,
    variants: product.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      selectedOptions: edge.node.selectedOptions,
    }))
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limited = searchParams.get('limited')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Try to fetch from Shopify first
    let products = []

    if (SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      try {
        let query = ''

        if (search) {
          query = `title:*${search}* OR tag:*${search}* OR product_type:*${search}*`
        }
        if (category) {
          query += query ? ` AND product_type:${category}` : `product_type:${category}`
        }
        if (featured === 'true') {
          query += query ? ` AND tag:featured` : `tag:featured`
        }
        if (limited === 'true') {
          query += query ? ` AND tag:limited-edition` : `tag:limited-edition`
        }

        const shopifyData = await fetchFromShopify(PRODUCTS_QUERY, {
          first: limit,
          query: query || undefined
        })

        if (shopifyData?.products?.edges) {
          products = shopifyData.products.edges.map(transformShopifyProduct)
        }
      } catch (error) {
        console.error('Shopify fetch failed, using fallback:', error)
      }
    }

    // If Shopify fails or is not configured, use fallback products
    if (products.length === 0) {
      products = [...fallbackProducts]

      // Apply filters to fallback products
      if (category) {
        products = products.filter(p =>
          p.category.toLowerCase() === category.toLowerCase()
        )
      }

      if (featured === 'true') {
        products = products.filter(p => p.isFeatured)
      }

      if (limited === 'true') {
        products = products.filter(p => p.isLimited)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        products = products.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // Apply limit
      products = products.slice(0, limit)
    }

    return successResponse({
      products,
      source: SHOPIFY_DOMAIN ? 'shopify' : 'fallback',
      total: products.length
    })

  } catch (error: any) {
    console.error('Get Shopify products error:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}
