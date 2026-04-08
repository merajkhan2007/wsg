'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-base pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] text-white py-24 px-6 sm:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Legal</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-serif tracking-tight leading-tight"
          >
            Terms of Service
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-neutral-400 font-light"
          >
            Last Updated: April 8, 2026
          </motion.p>
        </div>
      </section>

      {/* Main Content Info */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-8 md:p-12 lg:p-16 rounded-3xl shadow-soft border border-neutral-100"
        >
          <div className="prose prose-neutral max-w-none text-neutral-600 leading-loose">
            
            <p className="text-lg text-neutral-800 font-medium mb-8">
              Welcome to WeSoulGifts. Please read these Terms of Service completely before using wesoulgifts.com which is operated by WeSoulGifts Inc. This agreement documents the legally binding terms and conditions attached to the use of the site.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">2. Platform & Marketplace Rules</h2>
            <p>
              WeSoulGifts operates as an artisan marketplace. This means:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Sellers are third-party independent contractors and are strictly responsible for their own storefronts and creation times.</li>
              <li>Customers understand that item variations are a natural part of the handmade process.</li>
              <li>We hold the right to ban or remove users who engage in unlawful use of the platform, including abusive behavior towards artisans.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">3. User Accounts</h2>
            <p>
              When you create an account with us (be it as a Customer or Seller), you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
            </p>
            <p className="mt-4">
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">4. Seller Addendum</h2>
            <p>
              Sellers agreeing to use WeSoulGifts certify that all products uploaded are completely original, handmade, or hand-curated art. Mass-produced, plagiarized, or dropshipped items are vehemently prohibited and will result in permanent suspension. Sellers agree to a platform fee deducted from their finalized sales, subject to our fee schedule.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">5. Returns, Refunds, & Cancellations</h2>
            <p>
              Because WeSoulGifts items are heavily customized and handcrafted upon order:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Cancellations are only accepted within 24 hours of purchase, before the artisan begins their work.</li>
              <li>Returns are not generally accepted for customized items, unless the item arrives severely defective or damaged in transit.</li>
              <li>Disputes are handled through our support desk which mitigates conversations between the buyer and the seller objectively.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">6. Intellectual Property</h2>
            <p>
              The Site and its original content, features, and functionality are owned by WeSoulGifts and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. 
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">7. Changes to This Agreement</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
            </p>

          </div>
          
          <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-neutral-500">
               Questions about our terms? Reach out directly.
            </div>
            <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full font-semibold transition-colors text-sm">
               <Mail size={16} /> Contact Support
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
