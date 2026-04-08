'use client';

import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <Lock className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-white/90">Privacy & Security</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-serif tracking-tight leading-tight"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-neutral-400 font-light"
          >
            Effective Date: April 8, 2026
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
              At WeSoulGifts, we take your privacy incredibly seriously. This Privacy Policy details how we collect, use, and protect your personal information when you use our website, purchase gifts, or sell your handcrafted products on our platform.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">1. Information We Collect</h2>
            <p>
              When you interact with our platform, we may collect the following types of information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Personal Details:</strong> Name, email address, physical shipping address, and phone number when you register or check out.</li>
              <li><strong>Payment Information:</strong> We do not store raw credit card numbers. Payment processing is handled by secure, PCI-compliant third-party gateways.</li>
              <li><strong>Usage Data:</strong> Pages visited, browser type, and timestamps to help us improve the overall shopping experience.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">2. How We Use Your Information</h2>
            <p>
              Your data is exclusively utilized to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Process and fulfill your gift orders, including passing shipping addresses to our artisan sellers.</li>
              <li>Provide stellar customer support and handle any disputes.</li>
              <li>Send you updates on your order tracking and occasional promotional offers (only if you&apos;ve subscribed to our mailing list).</li>
              <li>Detect and prevent fraudulent activities on the platform.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">3. Sharing Information with Artisans</h2>
            <p>
              Because WeSoulGifts is a marketplace, we must share specific pieces of information (like your name and shipping destination) directly with the artisan fulfilling your order. <strong>Sellers are strictly forbidden from using customer data for off-platform marketing or contacting consumers for non-order related reasons.</strong>
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">4. Cookies and Tracking</h2>
            <p>
              We use &quot;cookies&quot; and similar tracking technologies to track activity on our platform. Cookies are files with minimal data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies across our site, although doing so might prevent you from successfully adding items to your shopping cart or checking out.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">5. Data Security</h2>
            <p>
              The security of your data is paramount to us, but remember that no method of transmission over the Internet is 100% secure. While we use commercially acceptable means to protect your Personal Data (like HTTPS encryption everywhere), we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-10 mb-4 border-b border-neutral-100 pb-2">6. Your Data Rights</h2>
            <p>
              You have the right to request access to the information we have about you, or ask that we delete your account entirely. To exercise these rights, please contact our support team.
            </p>

          </div>
          
          <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-neutral-500">
               Need more specifics about our privacy practices?
            </div>
            <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full font-semibold transition-colors text-sm">
               <Mail size={16} /> Privacy Team
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
