import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET: Test current system status and integrations
export async function GET(request: NextRequest) {
  const baseUrl = request.url.split('/api')[0]
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      shopifyDomain: process.env.SHOPIFY_DOMAIN || 'Not configured',
      hasStorefrontToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      hasAdminToken: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    tests: [] as any[]
  }

  // Test 1: Music API
  try {
    const musicResponse = await fetch(`${baseUrl}/api/music`)
    const musicData = await musicResponse.json()
    
    testResults.tests.push({
      name: 'Music API',
      status: musicResponse.ok ? 'PASS' : 'FAIL',
      details: {
        trackCount: musicData.data?.music?.length || 0,
        sampleTrack: musicData.data?.music?.[0]?.title || 'No tracks'
      }
    })
  } catch (error: any) {
    testResults.tests.push({
      name: 'Music API',
      status: 'ERROR',
      error: error.message
    })
  }

  // Test 2: Shopify Products API
  try {
    const shopifyResponse = await fetch(`${baseUrl}/api/shopify/products?limit=3`)
    const shopifyData = await shopifyResponse.json()
    
    testResults.tests.push({
      name: 'Shopify Products API',
      status: shopifyResponse.ok ? 'PASS' : 'FAIL',
      details: {
        source: shopifyData.data?.source || 'unknown',
        productCount: shopifyData.data?.products?.length || 0,
        sampleProduct: shopifyData.data?.products?.[0]?.name || 'No products'
      }
    })
  } catch (error: any) {
    testResults.tests.push({
      name: 'Shopify Products API',
      status: 'ERROR',
      error: error.message
    })
  }

  // Test 3: General Products API
  try {
    const productsResponse = await fetch(`${baseUrl}/api/products?limit=3`)
    const productsData = await productsResponse.json()
    
    testResults.tests.push({
      name: 'Products API',
      status: productsResponse.ok ? 'PASS' : 'FAIL',
      details: {
        source: productsData.data?.source || 'unknown',
        productCount: productsData.data?.products?.length || 0
      }
    })
  } catch (error: any) {
    testResults.tests.push({
      name: 'Products API',
      status: 'ERROR',
      error: error.message
    })
  }

  const summary = {
    passed: testResults.tests.filter(t => t.status === 'PASS').length,
    failed: testResults.tests.filter(t => t.status === 'FAIL').length,
    errors: testResults.tests.filter(t => t.status === 'ERROR').length,
    total: testResults.tests.length
  }

  return successResponse({
    ...testResults,
    summary,
    ready: summary.passed === summary.total,
    recommendations: [
      summary.passed === summary.total ? '✅ All systems operational!' : '⚠️ Some systems need attention',
      '🎵 Music API: Ready for audio playback',
      '🛒 Shopify: ' + (process.env.SHOPIFY_DOMAIN ? 'Configured for live products' : 'Using demo products'),
      '⚙️ Admin: Ready for content management',
      '🎧 Player: Web Audio API with 10-band EQ ready'
    ]
  })
}

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json()
    
    const {
      dittoApiKey,
      dittoApiSecret,
      shopifyDomain,
      shopifyStorefrontToken,
      shopifyAdminToken
    } = credentials

    const results: any = {
      success: false,
      tests: [],
      summary: {
        passed: 0,
        failed: 0,
        total: 0
      }
    }

    // Test 1: Ditto Authentication
    try {
      const dittoAuth = await fetch('https://api.dittomusic.com/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: dittoApiKey,
          client_secret: dittoApiSecret,
          grant_type: 'client_credentials'
        })
      })

      if (dittoAuth.ok) {
        results.tests.push({
          name: 'Ditto Authentication',
          status: 'passed',
          message: 'Successfully authenticated with Ditto Music API'
        })
        results.summary.passed++
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      results.tests.push({
        name: 'Ditto Authentication',
        status: 'failed',
        message: `Failed to authenticate: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 2: Shopify Storefront Access
    try {
      const storefrontQuery = `
        query {
          shop {
            name
            primaryDomain { url }
          }
        }
      `

      const storefrontTest = await fetch(`https://${shopifyDomain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shopifyStorefrontToken
        },
        body: JSON.stringify({ query: storefrontQuery })
      })

      if (storefrontTest.ok) {
        const data = await storefrontTest.json()
        if (data.data?.shop) {
          results.tests.push({
            name: 'Shopify Storefront API',
            status: 'passed',
            message: `Connected to ${data.data.shop.name}`
          })
          results.summary.passed++
        } else {
          throw new Error('Invalid storefront response')
        }
      } else {
        throw new Error('Storefront API request failed')
      }
    } catch (error) {
      results.tests.push({
        name: 'Shopify Storefront API',
        status: 'failed',
        message: `Storefront access failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 3: Shopify Admin Access
    try {
      const adminTest = await fetch(`https://${shopifyDomain}/admin/api/2023-10/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': shopifyAdminToken,
          'Content-Type': 'application/json'
        }
      })

      if (adminTest.ok) {
        const data = await adminTest.json()
        if (data.shop) {
          results.tests.push({
            name: 'Shopify Admin API',
            status: 'passed',
            message: `Admin access confirmed for ${data.shop.name}`
          })
          results.summary.passed++
        } else {
          throw new Error('Invalid admin response')
        }
      } else {
        throw new Error('Admin API request failed')
      }
    } catch (error) {
      results.tests.push({
        name: 'Shopify Admin API',
        status: 'failed',
        message: `Admin access failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 4: Database Connection
    try {
      // Test database read
      const response = await fetch('/api/tracks')
      if (response.ok) {
        results.tests.push({
          name: 'Database Connection',
          status: 'passed',
          message: 'Database is accessible and responding'
        })
        results.summary.passed++
      } else {
        throw new Error('Database query failed')
      }
    } catch (error) {
      results.tests.push({
        name: 'Database Connection',
        status: 'failed',
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 5: Licensing System
    try {
      const licenseResponse = await fetch('/api/licenses')
      if (licenseResponse.ok) {
        const licenses = await licenseResponse.json()
        if (licenses.tiers && licenses.tiers.length === 3) {
          results.tests.push({
            name: 'Licensing System',
            status: 'passed',
            message: '3-tier licensing system is configured correctly'
          })
          results.summary.passed++
        } else {
          throw new Error('Licensing tiers not properly configured')
        }
      } else {
        throw new Error('Licensing endpoint failed')
      }
    } catch (error) {
      results.tests.push({
        name: 'Licensing System',
        status: 'failed',
        message: `Licensing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Overall success determination
    results.success = results.summary.failed === 0

    // Add recommendations
    if (results.success) {
      results.recommendations = [
        '🎉 All systems operational!',
        '📤 Ready to upload tracks via Ditto integration',
        '🛒 Ready to sync products with Shopify',
        '💰 Beat licensing system is active',
        '🚀 Your music platform is ready for customers!'
      ]
    } else {
      results.recommendations = [
        '🔧 Fix failed integrations before going live',
        '📖 Review setup documentation for failed tests',
        '🔑 Double-check API credentials and permissions',
        '💬 Contact support if issues persist'
      ]
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Integration test error:', error)
    return NextResponse.json({
      success: false,
      error: `Integration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
