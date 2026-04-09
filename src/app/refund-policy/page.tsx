'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, CheckCircle, Ban, FileText, CheckSquare, CreditCard, Mail } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-base pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] text-white py-28 px-6 sm:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <RefreshCcw className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Returns & Replacements</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            Refund & Return <br className="hidden md:block" /> 
            <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Policy</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Effective Date: April 9, 2026
          </motion.p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Eligibility for Return */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">1. Eligibility for Return</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-2">Returns are accepted only if:</p>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Product is damaged</li>
              <li>Wrong item delivered</li>
              <li>Product is defective</li>
            </ul>
          </motion.div>

          {/* Card 2: Non-Returnable Items */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <Ban size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">2. Non-Returnable Items</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Customized or personalized products</li>
              <li>Used or altered items</li>
              <li>Items without original packaging</li>
            </ul>
          </motion.div>

          {/* Card 3: Return Request */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">3. Return Request</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Must be raised within 48 hours of delivery</li>
              <li>Share photo/video proof via email</li>
            </ul>
          </motion.div>

          {/* Card 4: Approval */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">4. Approval</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Requests are reviewed within 2–3 business days.
            </p>
          </motion.div>

          {/* Card 5: Refund */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">5. Refund</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Processed within 5–7 business days after approval</li>
              <li>Refunded to original payment method</li>
            </ul>
          </motion.div>

          {/* Card 6: Replacement */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
              <RefreshCcw size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">6. Replacement</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Replacement may be offered instead of refund in applicable cases.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Global Contact / CTA */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-accent/5 border border-brand-accent/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <Mail className="w-10 h-10 text-brand-accent mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">7. Contact</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
             If you require assistance with a return or refund, our support team is available to help clarify any details.
          </p>
          <a href="mailto:info@wesoulgifts.com" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Mail size={18} /> info@wesoulgifts.com
          </a>
        </motion.div>
      </section>

    </div>
  );
}
