import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getDatabase } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return errorResponse('Invalid signature', 400)
    }

    const db = getDatabase()

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order payment status
        if (paymentIntent.metadata.orderId) {
          db.prepare(`
            UPDATE orders 
            SET payment_status = 'completed', status = 'confirmed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND stripe_payment_intent_id = ?
          `).run(paymentIntent.metadata.orderId, paymentIntent.id)

          console.log(`Payment succeeded for order: ${paymentIntent.metadata.orderId}`)
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent

        // Update order payment status
        if (failedPayment.metadata.orderId) {
          db.prepare(`
            UPDATE orders 
            SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND stripe_payment_intent_id = ?
          `).run(failedPayment.metadata.orderId, failedPayment.id)

          console.log(`Payment failed for order: ${failedPayment.metadata.orderId}`)
        }
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent

        // Update order payment status
        if (canceledPayment.metadata.orderId) {
          db.prepare(`
            UPDATE orders 
            SET payment_status = 'canceled', status = 'canceled', updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND stripe_payment_intent_id = ?
          `).run(canceledPayment.metadata.orderId, canceledPayment.id)

          console.log(`Payment canceled for order: ${canceledPayment.metadata.orderId}`)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return successResponse({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return errorResponse('Webhook processing failed', 500)
  }
}