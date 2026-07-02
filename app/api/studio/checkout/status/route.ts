import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { successResponse, errorResponse } from '@/lib/api-response'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return errorResponse('Session ID is required', 400)
    }

    // Retrieve session details
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return successResponse({
      id: session.id,
      amount_total: session.amount_total || 0,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      status: session.status,
    })
  } catch (error: any) {
    console.error('[v0] Failed to retrieve session:', error)
    return errorResponse('Failed to retrieve order details', 500)
  }
}
