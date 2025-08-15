'use client';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Return & Refund Policy</h1>
        <p className="text-gray-600 mb-6">
          At The Fashion World, we aim to provide you with top-quality fashion products and a smooth shopping experience. Please read our return & refund policy carefully before placing an order.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Return Eligibility</h2>
          <p className="text-gray-600 mb-2">A product is eligible for return only if:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>The product received is damaged, defective, or incorrect (wrong color/size/product).</li>
            <li>You notify us of the issue within 24 to 48 hours after delivery.</li>
            <li>You provide unboxing video/photo proof as required.</li>
          </ul>
          <p className="text-gray-600 mt-4">Return is not accepted in the following cases:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>If you fail to inform us within 24 to 48 hours of delivery.</li>
            <li>If the product you received was the same one confirmed by you on call.</li>
            <li>If the product was used, washed, or damaged by the customer.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exchange Policy</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>In case of eligible return, we offer:</li>
            <li>Product exchange with another piece of the same price value.</li>
            <li>Exchange will be processed after receiving the returned item in proper condition.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Return Shipping</h2>
          <p className="text-gray-600 mb-2">If the return is due to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Our mistake (wrong/damaged item) → We will handle shipping.</li>
            <li>Customer’s personal reason → Return shipping charges must be paid by customer.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Timeline</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Refunds (if applicable) will be:</li>
            <li>Processed within 24 to 48 hours after we receive the product and verify the issue.</li>
            <li>Shipping charges will be deducted from the refund amount (if applicable).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Raise a Return Request?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Contact our support team via WhatsApp or Call within 24–48 hours of delivery.</li>
            <li>Share the unboxing video and issue clearly.</li>
            <li>Our team will verify and guide you through the return/exchange process.</li>
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