'use client';

import { motion } from 'framer-motion';
import { XCircle, Settings, ShieldAlert, Mail } from 'lucide-react';

export default function CancellationPolicyPage() {
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
            <XCircle className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Orders & Purchases</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            Cancellation <br className="hidden md:block" /> 
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Customer Cancellation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <XCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">1. Customer Cancellation</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Orders can be cancelled within 12 hours of placing the order</li>
              <li>Cancellation not allowed after processing begins</li>
            </ul>
          </motion.div>

          {/* Card 2: Customized Orders */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">2. Customized Orders</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Cannot be cancelled once customization starts</li>
            </ul>
          </motion.div>

          {/* Card 3: Cancellation by WeSoulGifts */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">3. Cancellation by WeSoulGifts</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-2">We may cancel orders due to:</p>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4 mb-4">
              <li>Stock unavailability</li>
              <li>Payment issues</li>
              <li>Fraud suspicion</li>
            </ul>
            <div className="mt-auto pt-4 border-t border-neutral-100">
              <p className="text-brand-primary text-sm font-medium">Full refund will be issued in such cases.</p>
            </div>
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">4. Contact</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            If you need help cancelling an order, please reach out to us as soon as possible.
          </p>
          <a href="mailto:info@wesoulgifts.com" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Mail size={18} /> info@wesoulgifts.com
          </a>
        </motion.div>
      </section>

    </div>
  );
}
