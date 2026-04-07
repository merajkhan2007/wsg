import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src="/logo.png" alt="WeSoulGifts" className="h-[60px] w-auto -ml-2" />
            <p className="text-gray-500 text-sm leading-relaxed mt-2">
              Curated emotional gifting for every celebration. Experience the joy of giving.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/category/birthday" className="hover:text-brand-pink transition-colors">Birthday Gifts</Link></li>
              <li><Link href="/category/anniversary" className="hover:text-brand-pink transition-colors">Anniversary</Link></li>
              <li><Link href="/category/love" className="hover:text-brand-pink transition-colors">Love & Romance</Link></li>
              <li><Link href="/shop" className="hover:text-brand-pink transition-colors">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-brand-pink transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-pink transition-colors">Contact</Link></li>
              <li><Link href="/sell" className="hover:text-brand-pink transition-colors">Become a Seller</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Stay Connected</h4>
            <p className="text-sm text-gray-500 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 border border-gray-200 rounded-l-md w-full focus:outline-none focus:border-brand-pink"
              />
              <button className="bg-brand-teal text-white px-4 py-2 rounded-r-md hover:bg-brand-burgundy transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} WeSoulGifts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
