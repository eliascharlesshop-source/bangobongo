import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Terms of Service | BangoBongo Music",
  description: "BangoBongo Music terms of service outline the rules and guidelines for using our website, music licensing, and services.",
}

export default function TermsOfServicePage() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-20 w-full h-screen overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%201%2C%202026%2C%2003_17_40%20PM-u4ZDFLD05VM5FtWJp8KTL7aIBGV4PB.png"
          alt="Terms of Service Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last Updated: March 9, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            These terms and conditions outline the rules and regulations for the use of our Website. By accessing this
            website, we assume you accept these terms and conditions in full. Do not continue to use our website if you
            do not accept all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, we own the intellectual property rights for all material on this Website. All
            intellectual property rights are reserved. You may view and/or print pages from the website for your own
            personal use subject to restrictions set in these terms and conditions.
          </p>
          <p className="mt-4">You must not:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Republish material from this website</li>
            <li>Sell, rent or sub-license material from this website</li>
            <li>Reproduce, duplicate or copy material from this website</li>
            <li>Redistribute content from this website (unless content is specifically made for redistribution)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Content</h2>
          <p>
            In these terms and conditions, "User Content" shall mean any audio, video, text, images or other material
            you choose to display on this Website. By displaying your User Content, you grant us a non-exclusive,
            worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and
            distribute it in any and all media.
          </p>
          <p className="mt-4">
            Your User Content must be your own and must not be infringing on any third party's rights. We reserve the
            right to remove any of your User Content from this Website at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p>
            In no event shall we, nor any of our directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Your access to or use of or inability to access or use the Service;</li>
            <li>Any conduct or content of any third party on the Service;</li>
            <li>Any content obtained from the Service; and</li>
            <li>Unauthorized access, use or alteration of your transmissions or content.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
            submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
            material change will be determined at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:bangobongo.ece@gmail.com" className="text-primary hover:underline">
              bangobongo.ece@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
    </>
  )
}
