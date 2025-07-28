import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy | BangoBongo Music", 
  description: "BangoBongo Music refund policy outlines the conditions under which we offer refunds for music licenses, merchandise, and services.",
}

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Refund Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last Updated: March 9, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Returns</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not entirely happy with your purchase,
            we're here to help.
          </p>
          <p className="mt-4">
            You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your
            item must be unused and in the same condition that you received it. Your item must be in the original
            packaging. Your item needs to have the receipt or proof of purchase.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
          <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item. We
            will immediately notify you on the status of your refund after inspecting the item.
          </p>
          <p className="mt-4">
            If your return is approved, we will initiate a refund to your credit card (or original method of payment).
            You will receive the credit within a certain amount of days, depending on your card issuer's policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Digital Products</h2>
          <p>We issue refunds for digital products within 14 days of the original purchase of the product.</p>
          <p className="mt-4">
            We recommend contacting us for assistance if you experience any issues receiving or downloading our
            products.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Event Tickets</h2>
          <p>All event ticket sales are final and non-refundable unless the event is canceled or rescheduled.</p>
          <p className="mt-4">
            If an event is canceled, you will receive a full refund for the face value of the ticket. If an event is
            rescheduled, your ticket will be valid for the new date, or you may request a refund within 30 days of the
            announcement of the new date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are
            non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about our Returns and Refunds Policy, please contact us at:
            <br />
            <a href="mailto:support@artistname.com" className="text-primary hover:underline">
              support@artistname.com
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
