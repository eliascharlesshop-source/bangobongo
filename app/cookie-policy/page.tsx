import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Artist Name",
  description: "Our cookie policy explains how we use cookies and similar technologies on our website.",
}

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Cookie Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last Updated: March 9, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in
            your web browser and allows the Service or a third-party to recognize you and make your next visit easier
            and the Service more useful to you.
          </p>
          <p className="mt-4">
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or
            mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p>When you use and access our Service, we may place a number of cookie files in your web browser.</p>
          <p className="mt-4">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>Essential cookies.</strong> We may use essential cookies to authenticate users and prevent
              fraudulent use of user accounts.
            </li>
            <li>
              <strong>Preferences cookies.</strong> We may use preferences cookies to remember information that changes
              the way the Service behaves or looks, such as the "remember me" functionality or a user's language
              preference.
            </li>
            <li>
              <strong>Analytics cookies.</strong> We may use analytics cookies to track information about how the
              Service is used so that we can make improvements.
            </li>
            <li>
              <strong>Marketing cookies.</strong> These cookies are used to track advertising effectiveness to provide a
              more relevant service and deliver better ads to suit your interests.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of
            the Service, deliver advertisements on and through the Service, and so on.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Your Choices Regarding Cookies</h2>
          <p>
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the
            help pages of your web browser.
          </p>
          <p className="mt-4">
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all
            of the features we offer, you may not be able to store your preferences, and some of our pages might not
            display properly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Where Can You Find More Information About Cookies</h2>
          <p>You can learn more about cookies and the following third-party websites:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              AllAboutCookies:{" "}
              <a
                href="https://www.allaboutcookies.org/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.allaboutcookies.org/
              </a>
            </li>
            <li>
              Network Advertising Initiative:{" "}
              <a
                href="https://www.networkadvertising.org/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.networkadvertising.org/
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at:
            <br />
            <a href="mailto:privacy@artistname.com" className="text-primary hover:underline">
              privacy@artistname.com
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
