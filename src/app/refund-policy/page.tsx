import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | WeSoulGifts',
  description: 'Learn about our refund and return policy.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-surface-light min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-3xl shadow-soft border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Refund & Return Policy</h1>
        <p className="text-gray-400 mb-10 text-sm font-semibold uppercase tracking-wider">Effective Date: April 9, 2026</p>
        
        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">1. Eligibility for Return</h3>
            <p className="mb-2">Returns are accepted only if:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product is damaged</li>
              <li>Wrong item delivered</li>
              <li>Product is defective</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">2. Non-Returnable Items</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customized or personalized products</li>
              <li>Used or altered items</li>
              <li>Items without original packaging</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">3. Return Request</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Must be raised within 48 hours of delivery</li>
              <li>Share photo/video proof via email</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">4. Approval</h3>
            <p>Requests are reviewed within 2–3 business days.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">5. Refund</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processed within 5–7 business days after approval</li>
              <li>Refunded to original payment method</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">6. Replacement</h3>
            <p>Replacement may be offered instead of refund in applicable cases.</p>
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
