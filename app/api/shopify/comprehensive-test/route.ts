import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'ERROR' | 'SKIP'
  message: string
  details?: any
  timestamp: string
}

// Test all Shopify integrations with your real store
export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    domain: process.env.SHOPIFY_DOMAIN,
    tests: [] as TestResult[]
  }

  console.log('🧪 Starting comprehensive Shopify integration test for bangobongo-music.myshopify.com...')

  // Test 1: Environment Configuration
  const envTest: TestResult = {
    name: 'Environment Configuration',
    status: 'PASS',
    message: 'Environment variables configured',
    timestamp: new Date().toISOString(),
    details: {
      domain: process.env.SHOPIFY_DOMAIN || 'missing',
      storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'configured' : 'missing',
      adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? 'configured' : 'missing',
      apiSecret: process.env.SHOPIFY_API_SECRET ? 'configured' : 'missing'
    }
  }

  if (!process.env.SHOPIFY_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    envTest.status = 'FAIL'
    envTest.message = 'Required environment variables missing'
  }

  results.tests.push(envTest)

  // Test 2: Storefront API Connection with your store
  if (process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    try {
      console.log('Testing direct connection to bangobongo-music.myshopify.com...')
      const query = `
        query getShop {
          shop {
            name
            description
            primaryDomain {
              url
            }
            currencyCode
          }
          products(first: 5) {
            edges {
              node {
                id
                title
                handle
                vendor
                productType
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `
      
      const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      
      if (response.ok && !data.errors) {
        results.tests.push({
          name: 'Shopify Store Connection',
          status: 'PASS',
          message: `Successfully connected to ${data.data.shop.name}`,
          details: {
            shopName: data.data.shop.name,
            domain: data.data.shop.primaryDomain.url,
            currency: data.data.shop.currencyCode,
            productCount: data.data.products.edges.length,
            sampleProducts: data.data.products.edges.map((edge: any) => ({
              title: edge.node.title,
              handle: edge.node.handle,
              vendor: edge.node.vendor,
              type: edge.node.productType,
              price: edge.node.priceRange.minVariantPrice.amount
            }))
          },
          timestamp: new Date().toISOString()
        })
      } else {
        results.tests.push({
          name: 'Shopify Store Connection',
          status: 'FAIL',
          message: `Connection failed: ${data.errors ? JSON.stringify(data.errors) : 'Unknown error'}`,
          details: { response: data },
          timestamp: new Date().toISOString()
        })
      }
    } catch (error: any) {
      results.tests.push({
        name: 'Shopify Store Connection',
        status: 'ERROR',
        message: `Error connecting to store: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }
  } else {
    results.tests.push({
      name: 'Shopify Store Connection',
      status: 'SKIP',
      message: 'Storefront API credentials not configured',
      timestamp: new Date().toISOString()
    })
  }

  // Test 3: Admin API Access
  if (process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    try {
      console.log('Testing Admin API access...')
      const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/shop.json`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
      })

      const data = await response.json()
      
      if (response.ok && data.shop) {
        results.tests.push({
          name: 'Admin API Access',
          status: 'PASS',
          message: `Admin access confirmed for ${data.shop.name}`,
          details: {
            shopName: data.shop.name,
            email: data.shop.email,
            domain: data.shop.domain,
            planName: data.shop.plan_name,
            timezone: data.shop.timezone
          },
          timestamp: new Date().toISOString()
        })
      } else {
        results.tests.push({
          name: 'Admin API Access',
          status: 'FAIL',
          message: `Admin API failed: ${response.status}`,
          details: data,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error: any) {
      results.tests.push({
        name: 'Admin API Access',
        status: 'ERROR',
        message: `Admin API error: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }
  } else {
    results.tests.push({
      name: 'Admin API Access',
      status: 'SKIP',
      message: 'Admin API credentials not configured',
      timestamp: new Date().toISOString()
    })
  }

  // Test 4: Product Management Capabilities
  if (process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    try {
      console.log('Testing product management capabilities...')
      const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/products.json?limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
      })

      const data = await response.json()
      
      if (response.ok) {
        results.tests.push({
          name: 'Product Management',
          status: 'PASS',
          message: `Found ${data.products.length} products in your store`,
          details: {
            productCount: data.products.length,
            products: data.products.slice(0, 3).map((product: any) => ({
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              productType: product.product_type,
              status: product.status,
              variantCount: product.variants.length
            }))
          },
          timestamp: new Date().toISOString()
        })
      } else {
        results.tests.push({
          name: 'Product Management',
          status: 'FAIL',
          message: `Product API failed: ${response.status}`,
          details: data,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error: any) {
      results.tests.push({
        name: 'Product Management',
        status: 'ERROR',
        message: `Product management error: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Test 5: Our API Integration
  try {
    console.log('Testing our internal Shopify API endpoints...')
    const baseUrl = request.url.split('/api')[0]
    const response = await fetch(`${baseUrl}/api/shopify/products?limit=5`)
    const data = await response.json()
    
    if (response.ok) {
      results.tests.push({
        name: 'Internal API Integration',
        status: 'PASS',
        message: `Our API successfully fetched ${data.data.products.length} products`,
        details: {
          source: data.data.source,
          productCount: data.data.products.length,
          sampleProduct: data.data.products[0] || null
        },
        timestamp: new Date().toISOString()
      })
    } else {
      results.tests.push({
        name: 'Internal API Integration',
        status: 'FAIL',
        message: `Our API failed: ${response.status}`,
        details: data,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error: any) {
    results.tests.push({
      name: 'Internal API Integration',
      status: 'ERROR',
      message: `Internal API error: ${error.message}`,
      timestamp: new Date().toISOString()
    })
  }

  // Calculate summary
  const passed = results.tests.filter(t => t.status === 'PASS').length
  const failed = results.tests.filter(t => t.status === 'FAIL').length
  const errors = results.tests.filter(t => t.status === 'ERROR').length
  const skipped = results.tests.filter(t => t.status === 'SKIP').length

  const summary = {
    passed,
    failed,
    errors,
    skipped,
    total: results.tests.length,
    overallStatus: failed > 0 || errors > 0 ? 'NEEDS_ATTENTION' : passed > 0 ? 'HEALTHY' : 'NOT_CONFIGURED'
  }

  console.log('🧪 Comprehensive test complete:', summary)

  return successResponse({
    ...results,
    summary,
    recommendations: [
      summary.overallStatus === 'HEALTHY' ? '✅ Your Shopify integration is fully operational!' : '⚠️ Some tests failed - check the details above',
      'Store: bangobongo-music.myshopify.com',
      'Ready to sync music products and merchandise',
      'Admin dashboard can manage products directly',
      'Customer-facing store displays real inventory'
    ]
  })
}

// POST: Test creating a sample product in your store
export async function POST(request: NextRequest) {
  try {
    const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN
    const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

    if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return errorResponse('Shopify Admin API credentials not configured', 500)
    }

    // Test product - a sample BangoBongo beat/track
    const testProduct = {
      product: {
        title: `BangoBongo - Test Beat - ${new Date().toISOString().split('T')[0]}`,
        body_html: `
          <h3>🎵 BangoBongo Electronic Beat</h3>
          <p>This is a test product created by the BangoBongo admin system to verify Shopify integration.</p>
          <ul>
            <li>🎧 High-quality electronic beat</li>
            <li>⚡ Perfect for electronic music projects</li>
            <li>📝 Includes basic license for non-commercial use</li>
            <li>🎛️ Professional production quality</li>
          </ul>
          <p><em>This is a test product and will be set as draft.</em></p>
        `,
        vendor: 'BangoBongo',
        product_type: 'Electronic Beat',
        tags: 'electronic, beat, bangobongo, test, music-production',
        status: 'draft', // Create as draft so it doesn't appear publicly
        variants: [{
          option1: 'Basic License',
          price: '25.00',
          inventory_quantity: 999,
          inventory_management: 'shopify',
          fulfillment_service: 'manual',
          inventory_policy: 'deny',
          requires_shipping: false, // Digital product
          taxable: true,
          sku: `BB-BEAT-TEST-${Date.now()}`
        }],
        options: [{
          name: 'License Type',
          values: ['Basic License']
        }]
      }
    }

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify(testProduct)
    })

    const data = await response.json()

    if (response.ok) {
      return successResponse({
        success: true,
        product: {
          id: data.product.id,
          title: data.product.title,
          handle: data.product.handle,
          vendor: data.product.vendor,
          status: data.product.status,
          adminUrl: `https://${SHOPIFY_DOMAIN.replace('.myshopify.com', '')}.myshopify.com/admin/products/${data.product.id}`
        },
        message: '🎉 Test product created successfully in your Shopify store!',
        instructions: [
          '📍 Product Location: Shopify Admin → Products → [Test Product]',
          '⚙️ Status: Draft (won\'t appear in public store)',
          '🗑️ You can delete this test product from your Shopify admin',
          '✅ This confirms your BangoBongo admin can create products in Shopify',
          '🎵 Ready to create real beats and merchandise!'
        ]
      })
    } else {
      return errorResponse(`Failed to create test product: ${JSON.stringify(data)}`, response.status)
    }

  } catch (error: any) {
    console.error('Test product creation error:', error)
    return errorResponse(`Test product creation failed: ${error.message}`, 500)
  }
}
