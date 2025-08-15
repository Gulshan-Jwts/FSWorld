'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Terms & Conditions</h1>
        <p className="text-gray-600 mb-6">
          Welcome to The Fashion World app. These Terms & Conditions govern your use of our platform, including browsing, purchasing, and communicating through our services. By using our app, you agree to these terms.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Creation & Use</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>We reserve the right to suspend or terminate accounts involved in suspicious or fraudulent activities.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders & Payments</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Orders are subject to availability and confirmation.</li>
            <li>We reserve the right to refuse or cancel any order due to errors, stock issues, or payment verification.</li>
            <li>Prices are subject to change without prior notice.</li>
            <li>Payment must be completed before dispatch.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping & Delivery</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Estimated delivery time is 5–7 business days (varies by location).</li>
            <li>Delays caused by courier services or external factors are not in our control.</li>
            <li>Delivery charges may apply based on order value and location.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns & Refunds</h2>
          <p className="text-gray-600">
            Please refer to our <Link href="/return-and-refund" className="text-blue-600 hover:underline">Return & Refund Policy</Link> for detailed guidelines.
          </p>
          <p className="text-gray-600">Returns are only accepted under specific conditions within the mentioned time frame.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Conduct</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You must not misuse the app or attempt to breach security.</li>
            <li>Any fraudulent, abusive, or illegal activity may result in account termination.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We reserve the right to update these Terms & Conditions at any time.</li>
            <li>Continued use of the app after changes implies acceptance of those changes.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">For any queries or support, feel free to reach out:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>Email: <a href="mailto:thefashionworld.customercare@gmail.com" className="text-blue-600 hover:underline">thefashionworld.customercare@gmail.com</a></li>
            <li>Phone: <a href="tel:+919137650662" className="text-blue-600 hover:underline">+91 9137650662</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}