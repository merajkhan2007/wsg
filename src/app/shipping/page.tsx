import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | WeSoulGifts',
  description: 'Learn about our shipping policy and delivery timelines.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-surface-light min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-soft border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Shipping Policy</h1>
        <p className="text-gray-400 mb-10 text-sm font-semibold uppercase tracking-wider">Effective Date: April 9, 2026</p>
        
        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">1. Processing Time</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders are processed within 2–5 business days</li>
              <li>Customized orders may take longer</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">2. Delivery Timeline</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard delivery: 5–10 business days across India</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">3. Shipping Charges</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Calculated at checkout or free (if applicable)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">4. Tracking</h3>
            <p>Tracking details will be shared via email/SMS after dispatch.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">5. Delays</h3>
            <p className="mb-2">We are not responsible for delays caused by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Courier services</li>
              <li>Weather conditions</li>
              <li>High demand periods</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">6. Failed Delivery</h3>
            <p className="mb-2">If delivery fails due to incorrect address or unavailability:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Re-shipping charges may apply</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">7. Contact</h3>
            <p>Email: <a href="mailto:info@wesoulgifts.com" className="text-brand-primary hover:underline font-medium">info@wesoulgifts.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
