import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

interface CartItem {
  id: string
  serviceId: string
  serviceName: string
  basePrice: number
  addOns: Array<{ id: string; name: string; price: number }>
  totalPrice: number
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, type } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return validationErrorResponse(['Cart items are required'])
    }

    if (type !== 'studio-services') {
      return validationErrorResponse(['Invalid checkout type'])
    }

    // Build line items from cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: CartItem) => {
      const description = item.addOns.length > 0
        ? `${item.serviceName} + ${item.addOns.map((ao) => ao.name).join(', ')}`
        : item.serviceName

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.serviceName,
            description,
            metadata: {
              serviceId: item.serviceId,
              type: 'studio-service',
            },
          },
          unit_amount: Math.round(item.totalPrice * 100), // Amount in cents
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/studio/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/studio/cart`,
      metadata: {
        type: 'studio-services',
        itemCount: items.length.toString(),
      },
    })

    if (!session.url) {
      return errorResponse('Failed to create checkout session', 500)
    }

    return successResponse({ url: session.url })
  } catch (error: any) {
    console.error('[v0] Studio checkout error:', error)
    return errorResponse(error.message || 'Failed to create checkout session', 500)
  }
}
