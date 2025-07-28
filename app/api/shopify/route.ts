import { NextRequest, NextResponse } from 'next/server'

// Shopify Storefront API configuration
const SHOPIFY_CONFIG = {
  domain: process.env.SHOPIFY_DOMAIN, // your-store.myshopify.com
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  apiVersion: '2024-01'
}

interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: Array<{
    url: string
    altText?: string
  }>
  variants: Array<{
    id: string
    title: string
    price: string
    compareAtPrice?: string
    availableForSale: boolean
    selectedOptions: Array<{
      name: string
      value: string
    }>
  }>
  tags: string[]
  productType: string
  vendor: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: string
    maxVariantPrice: string
  }
}

interface ShopifyCart {
  id: string
  lines: Array<{
    id: string
    quantity: number
    merchandise: {
      id: string
      title: string
      image?: {
        url: string
      }
      price: string
    }
  }>
  totalQuantity: number
  cost: {
    totalAmount: string
    subtotalAmount: string
    totalTaxAmount?: string
  }
  checkoutUrl: string
}

class ShopifyClient {
  private async storefrontQuery(query: string, variables?: any) {
    try {
      const response = await fetch(`https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken || ''
        },
        body: JSON.stringify({ query, variables })
      })

      const data = await response.json()
      
      if (data.errors) {
        throw new Error(`Shopify Storefront API error: ${JSON.stringify(data.errors)}`)
      }

      return data.data
    } catch (error) {
      throw new Error(`Shopify Storefront API request failed: ${error}`)
    }
  }

  private async adminQuery(query: string, variables?: any) {
    try {
      const response = await fetch(`https://${SHOPIFY_CONFIG.domain}/admin/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_CONFIG.adminAccessToken || ''
        },
        body: JSON.stringify({ query, variables })
      })

      const data = await response.json()
      
      if (data.errors) {
        throw new Error(`Shopify Admin API error: ${JSON.stringify(data.errors)}`)
      }

      return data.data
    } catch (error) {
      throw new Error(`Shopify Admin API request failed: ${error}`)
    }
  }

  async getProducts(first: number = 20, after?: string): Promise<{ products: ShopifyProduct[], hasNextPage: boolean, endCursor?: string }> {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
              handle
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
                    }
                    compareAtPrice {
                      amount
                    }
                    availableForSale
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
              priceRange {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
    `

    const data = await this.storefrontQuery(query, { first, after })
    
    return {
      products: data.products.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        images: edge.node.images.edges.map((img: any) => ({
          url: img.node.url,
          altText: img.node.altText
        })),
        variants: edge.node.variants.edges.map((variant: any) => ({
          id: variant.node.id,
          title: variant.node.title,
          price: variant.node.price.amount,
          compareAtPrice: variant.node.compareAtPrice?.amount,
          availableForSale: variant.node.availableForSale,
          selectedOptions: variant.node.selectedOptions
        })),
        tags: edge.node.tags,
        productType: edge.node.productType,
        vendor: edge.node.vendor,
        availableForSale: edge.node.availableForSale,
        priceRange: {
          minVariantPrice: edge.node.priceRange.minVariantPrice.amount,
          maxVariantPrice: edge.node.priceRange.maxVariantPrice.amount
        }
      })),
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor: data.products.pageInfo.endCursor
    }
  }

  async getProduct(handle: string): Promise<ShopifyProduct | null> {
    const query = `
      query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
                availableForSale
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
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
        }
      }
    `

    const data = await this.storefrontQuery(query, { handle })
    
    if (!data.productByHandle) return null

    const product = data.productByHandle
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      images: product.images.edges.map((img: any) => ({
        url: img.node.url,
        altText: img.node.altText
      })),
      variants: product.variants.edges.map((variant: any) => ({
        id: variant.node.id,
        title: variant.node.title,
        price: variant.node.price.amount,
        compareAtPrice: variant.node.compareAtPrice?.amount,
        availableForSale: variant.node.availableForSale,
        selectedOptions: variant.node.selectedOptions
      })),
      tags: product.tags,
      productType: product.productType,
      vendor: product.vendor,
      availableForSale: product.availableForSale,
      priceRange: {
        minVariantPrice: product.priceRange.minVariantPrice.amount,
        maxVariantPrice: product.priceRange.maxVariantPrice.amount
      }
    }
  }

  async createCart(): Promise<{ cartId: string }> {
    const query = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const data = await this.storefrontQuery(query)
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${data.cartCreate.userErrors[0].message}`)
    }

    return { cartId: data.cartCreate.cart.id }
  }

  async addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      image {
                        url
                      }
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
            totalQuantity
            cost {
              totalAmount {
                amount
              }
              subtotalAmount {
                amount
              }
              totalTaxAmount {
                amount
              }
            }
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const variables = {
      cartId,
      lines: [{
        merchandiseId: variantId,
        quantity
      }]
    }

    const data = await this.storefrontQuery(query, variables)
    
    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(`Add to cart failed: ${data.cartLinesAdd.userErrors[0].message}`)
    }

    const cart = data.cartLinesAdd.cart
    return {
      id: cart.id,
      lines: cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        merchandise: {
          id: edge.node.merchandise.id,
          title: edge.node.merchandise.title,
          image: edge.node.merchandise.image,
          price: edge.node.merchandise.price.amount
        }
      })),
      totalQuantity: cart.totalQuantity,
      cost: {
        totalAmount: cart.cost.totalAmount.amount,
        subtotalAmount: cart.cost.subtotalAmount.amount,
        totalTaxAmount: cart.cost.totalTaxAmount?.amount
      },
      checkoutUrl: cart.checkoutUrl
    }
  }

  async getCart(cartId: string): Promise<ShopifyCart> {
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    image {
                      url
                    }
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
          totalQuantity
          cost {
            totalAmount {
              amount
            }
            subtotalAmount {
              amount
            }
            totalTaxAmount {
              amount
            }
          }
          checkoutUrl
        }
      }
    `

    const data = await this.storefrontQuery(query, { cartId })
    
    if (!data.cart) {
      throw new Error('Cart not found')
    }

    const cart = data.cart
    return {
      id: cart.id,
      lines: cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        merchandise: {
          id: edge.node.merchandise.id,
          title: edge.node.merchandise.title,
          image: edge.node.merchandise.image,
          price: edge.node.merchandise.price.amount
        }
      })),
      totalQuantity: cart.totalQuantity,
      cost: {
        totalAmount: cart.cost.totalAmount.amount,
        subtotalAmount: cart.cost.subtotalAmount.amount,
        totalTaxAmount: cart.cost.totalTaxAmount?.amount
      },
      checkoutUrl: cart.checkoutUrl
    }
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string, quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      image {
                        url
                      }
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
            totalQuantity
            cost {
              totalAmount {
                amount
              }
              subtotalAmount {
                amount
              }
              totalTaxAmount {
                amount
              }
            }
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const data = await this.storefrontQuery(query, { cartId, lines })
    
    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(`Cart update failed: ${data.cartLinesUpdate.userErrors[0].message}`)
    }

    const cart = data.cartLinesUpdate.cart
    return {
      id: cart.id,
      lines: cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        merchandise: {
          id: edge.node.merchandise.id,
          title: edge.node.merchandise.title,
          image: edge.node.merchandise.image,
          price: edge.node.merchandise.price.amount
        }
      })),
      totalQuantity: cart.totalQuantity,
      cost: {
        totalAmount: cart.cost.totalAmount.amount,
        subtotalAmount: cart.cost.subtotalAmount.amount,
        totalTaxAmount: cart.cost.totalTaxAmount?.amount
      },
      checkoutUrl: cart.checkoutUrl
    }
  }

  // Sync BangoBongo products to Shopify
  async syncProductToShopify(product: any) {
    const mutation = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const productInput = {
      title: product.name,
      description: product.description,
      productType: product.category || 'Merchandise',
      vendor: 'BangoBongo',
      tags: product.tags || [],
      variants: [{
        price: product.price.toString(),
        compareAtPrice: product.originalPrice?.toString(),
        inventoryQuantity: product.inStock ? 100 : 0,
        inventoryPolicy: 'DENY',
        requiresShipping: true,
        taxable: true,
        weight: 0.5,
        weightUnit: 'POUNDS'
      }],
      images: product.images?.map((img: string) => ({ src: img })) || []
    }

    const data = await this.adminQuery(mutation, { input: productInput })
    
    if (data.productCreate.userErrors.length > 0) {
      throw new Error(`Product sync failed: ${data.productCreate.userErrors[0].message}`)
    }

    return {
      shopifyId: data.productCreate.product.id,
      handle: data.productCreate.product.handle
    }
  }
}

const shopifyClient = new ShopifyClient()

// GET: Fetch products from Shopify
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const handle = searchParams.get('handle')
    const first = parseInt(searchParams.get('first') || '20')
    const after = searchParams.get('after')

    if (handle) {
      // Get single product
      const product = await shopifyClient.getProduct(handle)
      return NextResponse.json({
        success: true,
        product
      })
    } else {
      // Get multiple products
      const result = await shopifyClient.getProducts(first, after || undefined)
      return NextResponse.json({
        success: true,
        ...result
      })
    }

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch products' 
      },
      { status: 500 }
    )
  }
}

// POST: Create cart or add to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, cartId, variantId, quantity } = body

    switch (action) {
      case 'createCart':
        const cart = await shopifyClient.createCart()
        return NextResponse.json({
          success: true,
          cart
        })

      case 'addToCart':
        const updatedCart = await shopifyClient.addToCart(cartId, variantId, quantity)
        return NextResponse.json({
          success: true,
          cart: updatedCart
        })

      case 'syncProduct':
        const { product } = body
        const syncResult = await shopifyClient.syncProductToShopify(product)
        return NextResponse.json({
          success: true,
          shopifyProduct: syncResult
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Operation failed' 
      },
      { status: 500 }
    )
  }
}

// PUT: Update cart
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, lines } = body

    const updatedCart = await shopifyClient.updateCartLines(cartId, lines)
    
    return NextResponse.json({
      success: true,
      cart: updatedCart
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Cart update failed' 
      },
      { status: 500 }
    )
  }
}
