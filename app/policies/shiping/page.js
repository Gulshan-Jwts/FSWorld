'use client';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Shipping & Delivery Policy</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Processing & Dispatch</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Orders will be dispatched within 48 hours after order confirmation.</li>
            <li>Once dispatched, full tracking details will be shared with the customer via WhatsApp, SMS, and Call.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Timeline</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Standard delivery time is 4 to 5 business days for most products.</li>
            <li>For Men&apos;s Wear products that are sourced internationally, delivery time will be 2 to 3 weeks.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">International Products Ordered Within India</h2>
          <p className="text-gray-600">
            Even if the order is placed from within India, if the product is sourced internationally, the same 2 to 3 week delivery timeline will apply.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Communication</h2>
          <p className="text-gray-600">
            Customers will receive real-time updates about their order status on their registered contact details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Support</h2>
          <p className="text-gray-600">For any queries, customers can reach out at:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>Email: <a href="mailto:thefashionworld.customercare@gmail.com" className="text-blue-600 hover:underline">thefashionworld.customercare@gmail.com</a></li>
            <li>Phone: <a href="tel:+919137650662" className="text-blue-600 hover:underline">+91 9137650662</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}