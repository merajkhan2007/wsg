'use client';

import { motion } from 'framer-motion';
import { Truck, Clock, Package, Search, AlertCircle, CreditCard, Mail, XCircle } from 'lucide-react';

export default function ShippingPage() {
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
            <Truck className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Shipping & Delivery</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            Our Shipping <br className="hidden md:block" /> 
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
          
          {/* Card 1: Processing Time */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
              <Package size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">1. Processing Time</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Orders are processed within 2–5 business days</li>
              <li>Customized orders may take longer</li>
            </ul>
          </motion.div>

          {/* Card 2: Delivery Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">2. Delivery Timeline</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Standard delivery: 5–10 business days across India</li>
            </ul>
          </motion.div>

          {/* Card 3: Shipping Charges */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">3. Shipping Charges</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Calculated at checkout or free (if applicable)</li>
            </ul>
          </motion.div>

          {/* Card 4: Tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">4. Tracking</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Tracking details will be shared via email/SMS after dispatch.
            </p>
          </motion.div>

          {/* Card 5: Delays */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">5. Delays</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-2">We are not responsible for delays caused by:</p>
            <ul className="text-neutral-500 space-y-1 text-sm leading-relaxed list-disc pl-4">
              <li>Courier services</li>
              <li>Weather conditions</li>
              <li>High demand periods</li>
            </ul>
          </motion.div>

          {/* Card 6: Failed Delivery */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <XCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">6. Failed Delivery</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-2">If delivery fails due to incorrect address or unavailability:</p>
            <ul className="text-neutral-500 space-y-1 text-sm leading-relaxed list-disc pl-4">
              <li>Re-shipping charges may apply</li>
            </ul>
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
            Have questions about your shipment? Our support team is here to help you every step of the way.
          </p>
          <a href="mailto:info@wesoulgifts.com" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Mail size={18} /> info@wesoulgifts.com
          </a>
        </motion.div>
      </section>

    </div>
  );
}
