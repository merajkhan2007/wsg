'use client';

import { motion } from 'framer-motion';
import { Lock, FileText, Settings, Users, Fingerprint, ShieldCheck, Key, Mail } from 'lucide-react';

export default function PrivacyPage() {
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
            <Lock className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Privacy & Security</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            Privacy <br className="hidden md:block" /> 
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
        
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           className="bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-neutral-100 mb-8 max-w-4xl mx-auto text-center"
        >
          <p className="text-lg text-neutral-700 leading-relaxed font-medium">
             At WeSoulGifts, we take your privacy incredibly seriously. This Privacy Policy details how we collect, use, and protect your personal information when you use our website, purchase gifts, or sell your handcrafted products on our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Information We Collect */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">1. Information We Collect</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li><strong>Personal Details:</strong> Name, email, shipping address, and phone number.</li>
              <li><strong>Payment Info:</strong> Processed by secure, third-party gateways (no raw cards stored).</li>
              <li><strong>Usage Data:</strong> Pages visited, browser type, to improve shopping experience.</li>
            </ul>
          </motion.div>

          {/* Card 2: How We Use Your Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">2. How We Use Information</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Process and fulfill your gift orders.</li>
              <li>Provide stellar customer support.</li>
              <li>Send tracking updates and promotional offers (if subscribed).</li>
              <li>Detect and prevent fraudulent activities.</li>
            </ul>
          </motion.div>

          {/* Card 3: Sharing with Artisans */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">3. Sharing with Artisans</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-4">
              We share shipping details with artisans to fulfill orders.
            </p>
            <p className="text-brand-primary text-xs font-semibold uppercase tracking-wide">
              Sellers are strictly forbidden from using customer data for off-platform marketing.
            </p>
          </motion.div>

          {/* Card 4: Cookies & Tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <Fingerprint size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">4. Cookies & Tracking</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              We use &quot;cookies&quot; to track activity on our platform to ensure carts function and checkout succeeds. Refusing cookies may prevent successful purchases.
            </p>
          </motion.div>

          {/* Card 5: Data Security */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">5. Data Security</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-2">The security of your data is paramount:</p>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>HTTPS encryption is standard.</li>
              <li>Commercially acceptable methods secure Personal Data, though no internet method is 100% secure.</li>
            </ul>
          </motion.div>

          {/* Card 6: Your Data Rights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
              <Key size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">6. Your Data Rights</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              You have the right to request access to the information we have about you, or ask that we delete your account entirely. Contact support to exercise these rights.
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">Privacy Concerns?</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            If you need specifics about our privacy practices, our dedicated Privacy Team is available to help.
          </p>
          <a href="mailto:info@wesoulgifts.com" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Mail size={18} /> Contact Privacy Team
          </a>
        </motion.div>
      </section>

    </div>
  );
}
