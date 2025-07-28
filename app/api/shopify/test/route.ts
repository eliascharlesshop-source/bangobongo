import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { domain, storefrontToken, adminToken } = await req.json()

    if (!domain || !storefrontToken || !adminToken) {
      return NextResponse.json({
        success: false,
        error: 'Domain, Storefront Token, and Admin Token are required'
      }, { status: 400 })
    }

    const results: any = {
      success: false,
      storefront: null,
      admin: null,
      storefrontError: null,
      adminError: null
    }

    // Test Storefront API
    try {
      const storefrontQuery = `
        query {
          shop {
            name
            description
            primaryDomain {
              url
            }
          }
        }
      `

      const storefrontResponse = await fetch(`https://${domain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken
        },
        body: JSON.stringify({ query: storefrontQuery })
      })

      if (storefrontResponse.ok) {
        const storefrontData = await storefrontResponse.json()
        if (storefrontData.data && storefrontData.data.shop) {
          results.storefront = {
            name: storefrontData.data.shop.name,
            description: storefrontData.data.shop.description,
            domain: storefrontData.data.shop.primaryDomain.url,
            status: 'Connected successfully'
          }
        } else {
          results.storefrontError = 'Invalid response from Storefront API'
        }
      } else {
        const errorData = await storefrontResponse.json().catch(() => ({}))
        results.storefrontError = `Storefront API error: ${errorData.errors?.[0]?.message || storefrontResponse.statusText}`
      }
    } catch (error) {
      results.storefrontError = `Storefront connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Test Admin API
    try {
      const adminResponse = await fetch(`https://${domain}/admin/api/2023-10/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json'
        }
      })

      if (adminResponse.ok) {
        const adminData = await adminResponse.json()
        if (adminData.shop) {
          results.admin = {
            id: adminData.shop.id,
            name: adminData.shop.name,
            email: adminData.shop.email,
            domain: adminData.shop.domain,
            currency: adminData.shop.currency,
            timezone: adminData.shop.timezone,
            status: 'Connected successfully'
          }

          // Test products endpoint
          const productsResponse = await fetch(`https://${domain}/admin/api/2023-10/products.json?limit=1`, {
            headers: {
              'X-Shopify-Access-Token': adminToken,
              'Content-Type': 'application/json'
            }
          })

          if (productsResponse.ok) {
            const productsData = await productsResponse.json()
            results.admin.productsCount = productsData.products?.length || 0
            results.admin.capabilities = [
              'Read/Write Products',
              'Read/Write Orders', 
              'Read/Write Customers',
              'Read Inventory'
            ]
          }
        } else {
          results.adminError = 'Invalid response from Admin API'
        }
      } else {
        const errorData = await adminResponse.json().catch(() => ({}))
        results.adminError = `Admin API error: ${errorData.errors || adminResponse.statusText}`
      }
    } catch (error) {
      results.adminError = `Admin connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // Determine overall success
    results.success = !results.storefrontError && !results.adminError

    return NextResponse.json(results)

  } catch (error) {
    console.error('Shopify API test error:', error)
    return NextResponse.json({
      success: false,
      error: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
