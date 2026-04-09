'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CheckSquare, Gavel, User, Store, RefreshCcw, Award, Edit, Mail } from 'lucide-react';

export default function TermsPage() {
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
            <ShieldCheck className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Legal Agreements</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            Terms of <br className="hidden md:block" /> 
            <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Service</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Last Updated: April 8, 2026
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
             Welcome to WeSoulGifts. By accessing and using wesoulgifts.com, operated by WeSoulGifts Inc, you are agreeing to these legally binding terms and conditions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Acceptance of Terms */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">1. Acceptance of Terms</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              By using our service, you agree to be bound by these provisions, rules, and guidelines. If you disagree, you must cease using this platform immediately.
            </p>
          </motion.div>

          {/* Card 2: Platform Rules */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
              <Gavel size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">2. Marketplace Rules</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Sellers are third-party independent contractors responsible for their creation times.</li>
              <li>Item variations are a natural part of the handmade process.</li>
              <li>We may ban users who engage in unlawful or abusive behavior.</li>
            </ul>
          </motion.div>

          {/* Card 3: User Accounts */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">3. User Accounts</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-4">
              Account information must be accurate, complete, and current. You are entirely responsible for safeguarding your password.
            </p>
          </motion.div>

          {/* Card 4: Seller Addendum */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors text-center md:text-left"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 mx-auto md:mx-0">
              <Store size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">4. Seller Addendum</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Sellers certify that all products are original. Mass-produced, plagiarized, or dropshipped items are prohibited. Sellers agree to a platform fee deducted from finalized sales.
            </p>
          </motion.div>

          {/* Card 5: Returns & Refunds */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <RefreshCcw size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">5. Changes & Returns</h3>
            <ul className="text-neutral-500 space-y-2 text-sm leading-relaxed list-disc pl-4">
              <li>Cancellations are accepted within 24 hours of purchase.</li>
              <li>Returns are not accepted for customized items unless defective.</li>
              <li>Disputes are handled objectively via our support desk.</li>
            </ul>
          </motion.div>

          {/* Card 6: Intellectual Property */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">6. Intellectual Property</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              The Site and its original content are owned by WeSoulGifts and protected by international proprietary rights laws.
            </p>
          </motion.div>

          {/* Card 7: Modifications */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-100 flex flex-col h-full hover:border-brand-accent/30 transition-colors lg:col-span-3 lg:w-2/3 lg:mx-auto"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <Edit size={24} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4 font-serif">7. Changes to This Agreement</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              We reserve the right to modify these Terms at any time by updating this page. Your continued use of the Site after changes constitutes your formal acceptance of the new Terms of Service.
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
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-4">Questions about our Terms?</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6">
            If you need further clarification regarding our legal policies or your rights, please reach out directly.
          </p>
          <a href="mailto:info@wesoulgifts.com" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full font-semibold hover:bg-[#15827c] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Mail size={18} /> Contact Support
          </a>
        </motion.div>
      </section>

    </div>
  );
}
