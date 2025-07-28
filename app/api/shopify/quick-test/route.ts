import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const domain = process.env.SHOPIFY_DOMAIN
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    if (!domain || !storefrontToken) {
      return NextResponse.json({
        success: false,
        error: 'Missing Shopify configuration',
        details: {
          domain: !!domain,
          token: !!storefrontToken
        }
      }, { status: 400 })
    }

    // Test Shopify Storefront API connection
    const query = `
      query {
        shop {
          name
          description
          primaryDomain {
            url
          }
          paymentSettings {
            currencyCode
            acceptedCardBrands
          }
        }
      }
    `

    console.log('Testing Shopify connection...', { domain, tokenPrefix: storefrontToken.substring(0, 8) + '...' })

    const response = await fetch(`https://${domain}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken
      },
      body: JSON.stringify({ query })
    })

    console.log('Shopify response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify error response:', errorText)
      
      return NextResponse.json({
        success: false,
        error: `Shopify API error: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('Shopify response data:', data)

    if (data.errors) {
      return NextResponse.json({
        success: false,
        error: 'GraphQL errors',
        details: data.errors
      }, { status: 400 })
    }

    if (data.data?.shop) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to Shopify!',
        shop: {
          name: data.data.shop.name,
          description: data.data.shop.description,
          domain: data.data.shop.primaryDomain.url,
          currency: data.data.shop.paymentSettings.currencyCode,
          acceptedCards: data.data.shop.paymentSettings.acceptedCardBrands
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid response from Shopify',
        details: data
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Shopify test error:', error)
    return NextResponse.json({
      success: false,
      error: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
