'use client';

import { motion } from 'framer-motion';
import { Globe, Rocket, TrendingUp, Palette, ShoppingBag, Zap, Heart, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium tracking-wide text-brand-primary">We Provide</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 font-serif tracking-tight leading-tight"
          >
            We <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Provide</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed mb-10"
          >
            WeSoulGifts is dedicated to empowering artisans by offering a global platform where creators of handmade products—such as painters, handicraft artists, woodcraft makers, and more—can showcase their talent to the world.
          </motion.p>
        </div>
      </section>

      {/* Image Banner Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 -mt-16 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
            alt="Handcrafting gifts" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
             <div className="p-8 md:p-12 text-white">
                <p className="font-serif text-2xl md:text-4xl italic text-white/90 drop-shadow-md">&quot;Every piece reflects love and personal expression.&quot;</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Our Aim & Mission */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-full bg-brand-accent/5 absolute -top-10 -left-10 w-full max-w-[400px] blur-3xl"></div>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-neutral-900 mb-6">Our Aim</h2>
            <p className="text-neutral-600 leading-relaxed text-lg mb-6">
              Our mission is to help sellers gain authentic customer reach, recognition, and growth opportunities. At the same time, customers can explore a wide variety of unique, high-quality handmade products at affordable prices—all in one place, just a click away.
            </p>
            <p className="text-neutral-600 leading-relaxed text-lg mb-6">
              At WeSoulGifts, we believe in celebrating art and culture. Every handmade product carries a unique story, emotion, and craftsmanship that makes it truly special.
            </p>
            <p className="text-neutral-600 leading-relaxed text-lg">
              We aim to build a strong connection between talented artisans and people who appreciate handmade creativity. Whether it&apos;s a customized gift or a decorative item, every piece reflects love and personal expression—making it perfect for your loved ones.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full flex items-center justify-center"
          >
            <div className="relative w-full">
              <div className="absolute inset-0 bg-brand-primary/20 rounded-3xl transform translate-x-4 translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop" 
                alt="Gift wrapping" 
                className="relative w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-xl z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Sellers Get */}
      <section className="py-24 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-semibold text-neutral-900 mb-4"
          >
            What Sellers Get
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 max-w-2xl mx-auto mb-16 text-lg"
          >
            WeSoulGifts is more than just a selling platform—it&apos;s a growth ecosystem for artisans. We ensure every artisan gets the support they need to succeed.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Global Exposure", desc: "Showcase your talent to a worldwide audience" },
              { icon: Rocket, title: "Growth Support", desc: "Step-by-step guidance from registration to selling" },
              { icon: TrendingUp, title: "Sales Boost", desc: "Marketing and platform support to increase visibility" },
              { icon: Palette, title: "Recognition", desc: "Get acknowledged for your creativity and craftsmanship" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-brand-base p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-soft border border-transparent hover:border-brand-primary/20 group"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm text-brand-accent flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:text-brand-primary transition-all duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Users */}
      <section className="py-24 bg-brand-base border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-semibold text-neutral-900 mb-4"
          >
            For Users
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 max-w-3xl mx-auto mb-16 text-lg"
          >
            We understand the love for handmade and customized products—but finding them online can be time-consuming and scattered across multiple platforms. WeSoulGifts solves this problem by bringing everything together in one place. Your perfect handmade product is just a click away.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: "Discover", desc: "A wide range of authentic handmade products" },
              { icon: Zap, title: "Experience", desc: "A smooth, fast, and elegant shopping experience" },
              { icon: Heart, title: "Connect", desc: "Find meaningful, personalized gifts easily" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 hover:shadow-soft border border-neutral-100"
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl text-brand-primary flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section / Thank You */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#1A1A1A] rounded-[40px] p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white mb-6">Thank You ❤️</h2>
            <p className="text-[#a1a1aa] max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
              We truly appreciate your interest in WeSoulGifts and would love to have you as part of our growing community. Now, you don&apos;t have to search everywhere—your perfect handmade product is just a click away.
            </p>
            <p className="text-[#a1a1aa] max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
              Stay connected with us to receive updates on new arrivals, exclusive offers, and special deals. Don&apos;t forget to subscribe to our mailing list!
              <br /><br />
              <span className="font-serif italic text-white/90">— Team WeSoulGifts</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <Link href="/shop" className="px-8 py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-full font-semibold transition-all duration-300 w-full sm:w-auto shadow-glow flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" /> Explore Collection
              </Link>
              <Link href="/login?tab=register&role=seller" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto flex items-center justify-center">
                 Join as Seller
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
