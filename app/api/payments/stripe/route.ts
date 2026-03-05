import { NextRequest } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { getDatabase } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  orderId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()

    // Validate input
    const validation = createPaymentIntentSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map(err => err.message)
      return validationErrorResponse(errors)
    }

    const { amount, currency, orderId } = validation.data

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: user.id,
        orderId: orderId || ''
      }
    })

    // If orderId is provided, update the order with payment intent ID
    if (orderId) {
      const db = getDatabase()
      db.prepare(`
        UPDATE orders 
        SET stripe_payment_intent_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `).run(paymentIntent.id, orderId, user.id)
    }

    return successResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error: any) {
    console.error('Create payment intent error:', error)

    if (error.message === 'Authentication required') {
      return errorResponse(error.message, 401)
    }

    return errorResponse('Failed to create payment intent', 500)
  }
}