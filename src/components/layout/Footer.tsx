import Link from 'next/link';
import { Mail, MapPin, Lock, CreditCard, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-dark pt-16 pb-8 mt-auto text-white/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
               <span className="text-2xl font-bold bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent tracking-tight">WeSoulGifts</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              Where thoughtful gifting meets passionate creators — a platform to buy and sell unique handmade products with a story.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.66c0-2.5 1.5-3.89 3.77-3.89 1.1 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10.05 10.05 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02Z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-sm tracking-widest uppercase">Categories</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop?category=home%20decor" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> Home Decor</Link></li>
              <li><Link href="/shop?category=handicrafts" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> HandiCrafts</Link></li>
              <li><Link href="/shop?category=jewellery%20%26%20accessories" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> Jewellery</Link></li>
              <li><Link href="/shop?category=personalized%20gifts" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> Personalized Gifts</Link></li>
              <li><Link href="/shop?category=art%20%26%20paintings" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> Art & Paintings</Link></li>
              <li><Link href="/shop?category=festival%20%26%20festive" className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary/50"></span> Festivals</Link></li>
            </ul>
          </div>

          {/* Column 3: Occasions & Company */}
          <div className="space-y-10 lg:space-y-8">
            <div>
              <h4 className="font-semibold mb-6 text-white text-sm tracking-widest uppercase">Occasions</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/category/birthday" className="text-brand-secondary hover:text-brand-primary transition-colors">Birthday Gifts</Link></li>
                <li><Link href="/category/anniversary" className="text-brand-secondary hover:text-brand-primary transition-colors">Anniversaries</Link></li>
                <li><Link href="/category/love" className="text-brand-secondary hover:text-brand-primary transition-colors">Love & Romance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white text-sm tracking-widest uppercase">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-brand-secondary hover:text-brand-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-brand-secondary hover:text-brand-primary transition-colors">Contact</Link></li>
                <li><Link href="/register?role=seller" className="text-brand-secondary hover:text-brand-primary transition-colors">Become a Seller</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-sm tracking-widest uppercase">Stay Updated</h4>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Join our mailing list to receive updates on artisan stories and exclusive offers.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl w-full focus:outline-none focus:border-brand-primary text-white text-sm placeholder:text-neutral-600 transition-colors"
              />
              <button className="bg-brand-primary text-white px-4 py-3 rounded-xl hover:bg-[#d63b63] transition-all duration-300 text-sm font-semibold shadow-glow">
                Subscribe
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <a href="mailto:support@wesoulgifts.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                <Mail size={16} className="text-neutral-500 group-hover:text-brand-primary transition-colors" /> support@wesoulgifts.com
              </a>
            </div>
          </div>

        </div>

        {/* Secure & Trust Bar */}
        <div className="py-6 mb-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white/80">
            <ShieldCheck className="text-brand-primary" size={24} />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider uppercase text-white">100% Secure Shopping</span>
              <span className="text-xs text-white/60">SSL Encrypted Checkout</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold mr-2">We Accept</span>
            <div className="flex gap-2">
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center border border-white/5">
                <CreditCard size={18} className="text-white/80" />
              </div>
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center border border-white/5 text-xs font-bold text-white/80">
                UPI
              </div>
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center border border-white/5 text-[10px] font-bold text-white/80 leading-none text-center px-1">
                Net Banking
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} WeSoulGifts. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-brand-secondary hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-brand-secondary hover:text-brand-primary transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="text-brand-secondary hover:text-brand-primary transition-colors">Refund Policy</Link>
            <Link href="/cancellation-policy" className="text-brand-secondary hover:text-brand-primary transition-colors">Cancellation Policy</Link>
            <Link href="/shipping" className="text-brand-secondary hover:text-brand-primary transition-colors">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
