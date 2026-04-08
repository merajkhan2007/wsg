'use client';

import { motion } from 'framer-motion';
import { Truck, Clock, Map, Package, Shield, Globe, MapPin, Search, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';

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
            Delivering Joy, <br className="hidden md:block" /> 
            <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Every Single Time</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Fast, secure, and transparent shipping. We ensure your handcrafted gifts arrive safely to celebrate your special moments.
          </motion.p>
        </div>
      </section>

      {/* Main Content Info */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 -mt-10 relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline / Track Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 h-full">
              <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                <Search size={28} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 font-serif">Track Your Order</h3>
              <p className="text-neutral-500 mb-8 leading-relaxed">
                As soon as your artisan finishes your gift and it ships out, we&apos;ll email you a unique tracking number to follow your package&apos;s journey.
              </p>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-accent before:via-brand-primary before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-accent text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <Package size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-neutral-100 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-neutral-800 text-sm">Processing</h4>
                          </div>
                      </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <Truck size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-neutral-100 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-neutral-800 text-sm">Shipped</h4>
                          </div>
                      </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-neutral-200 text-neutral-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <MapPin size={16} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-neutral-100 shadow-sm text-opacity-50">
                          <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-neutral-400 text-sm">Delivered</h4>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </motion.div>

          {/* Details / FAQs Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Delivery Speeds */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-neutral-100">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6">Delivery Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-brand-base border border-neutral-100 hover:border-brand-accent/30 transition-colors">
                  <Clock className="w-8 h-8 text-brand-accent mb-4" />
                  <h3 className="font-bold text-lg text-neutral-900 mb-2">Standard Delivery</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                    Reliable delivery for your everyday gifting needs. Handled with care from the artisan&apos;s workshop directly to your door.
                  </p>
                  <span className="inline-block px-3 py-1 bg-white rounded-md text-xs font-semibold text-neutral-700 shadow-sm border border-neutral-100">4-7 Business Days</span>
                </div>
                <div className="p-6 rounded-2xl bg-[#1A1A1A] text-white border border-transparent hover:border-brand-primary/50 transition-colors relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-primary rounded-full mix-blend-multiply opacity-20 blur-2xl"></div>
                  <Zap className="w-8 h-8 text-brand-primary mb-4" />
                  <h3 className="font-bold text-lg text-white mb-2">Express Delivery</h3>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                    Need it fast? Upgrade to Express to prioritize the shipping carrier speed for last-minute celebrations.
                  </p>
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-md text-xs font-semibold text-white border border-white/20">2-3 Business Days</span>
                </div>
              </div>
            </div>

            {/* Information Accordion / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100">
                <Map className="w-8 h-8 text-neutral-400 mb-4" />
                <h3 className="font-bold text-lg text-neutral-900 mb-2">Processing Time</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Because our products are handmade, personalized, or custom-crafted, please allow <strong className="text-neutral-700">1-3 days</strong> for the artisans to lovingly create and prepare your order before it gets dispatched.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100">
                <Shield className="w-8 h-8 text-neutral-400 mb-4" />
                <h3 className="font-bold text-lg text-neutral-900 mb-2">Secure & Insured</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Every package we send is fully insured. If your handmade gift arrives damaged during transit, we take full responsibility and will arrange a replacement free of charge.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Global Shipping Disclaimer */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-accent/5 border border-brand-accent/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <Globe className="w-12 h-12 text-brand-accent mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">Do we ship internationally?</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Currently, WeSoulGifts primarily operates within India to support local artisans and ensure rapid delivery times. We are aggressively working on launching global shipping soon so the whole world can experience our artisans&apos; crafts!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/shop" className="px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all">Start Shopping</Link>
             <Link href="/contact" className="px-8 py-3 bg-white text-neutral-700 border border-neutral-200 rounded-full font-semibold hover:bg-brand-base transition-all flex items-center gap-2"><AlertCircle size={18} /> Need Help?</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
