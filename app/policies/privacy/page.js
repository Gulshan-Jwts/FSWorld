'use client';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">
          At The Fashion World, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, share, and protect the information you provide to us when using our mobile app or website.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Name, contact number, email address, delivery address</li>
            <li>Payment and billing information</li>
            <li>Purchase and order history</li>
            <li>Device information, IP address, and app usage data</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To process orders and deliver products</li>
            <li>To communicate updates, offers, and confirmations</li>
            <li>To improve user experience and app performance</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sharing Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We do not sell or rent your personal information.</li>
            <li>We may share data with trusted third-party services (e.g., payment gateways, courier services) only to complete transactions.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We use encryption, secure servers, and industry-standard measures to protect your information.</li>
            <li>Despite our efforts, no method of transmission over the Internet or method of electronic storage is 100% secure.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You can request access, correction, or deletion of your personal data.</li>
            <li>You may opt-out of promotional communications at any time.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">If you have any questions or concerns about this policy, please contact us at:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>Email: <a href="mailto:thefashionworld.customercare@gmail.com" className="text-blue-600 hover:underline">thefashionworld.customercare@gmail.com</a></li>
            <li>Phone: <a href="tel:+919137650662" className="text-blue-600 hover:underline">+91 9137650662</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}