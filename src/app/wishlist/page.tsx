"use client";

import { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    if (storedToken) {
      fetch('/api/customer/wishlist', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWishlist(data);
      })
      .finally(() => setLoading(false));
    } else {
      const existing = localStorage.getItem('wishlist');
      setWishlist(existing ? JSON.parse(existing) : []);
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = async (id: number) => {
    if (token) {
      await fetch(`/api/customer/wishlist?product_id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item.id !== id));
    } else {
      const updated = wishlist.filter(item => item.id !== id);
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
    window.dispatchEvent(new Event('wishlist_updated'));
  };

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-500 mb-10">Manage the items you love.</p>
        
        {loading ? (
           <div className="py-20 flex justify-center"><div className="w-8 h-8 rounded-full border-b-2 border-brand-accent animate-spin"></div></div>
        ) : wishlist.length === 0 ? (
           <div className="bg-surface-light rounded-3xl p-16 flex flex-col items-center justify-center text-center">
              <Heart size={64} className="text-gray-200 mb-6" />
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-sm">Save your favorite gifts here by clicking the heart icon on any product.</p>
              <Link href="/shop" className="bg-brand-accent text-white px-8 py-3 rounded-full font-medium hover:bg-brand-dark transition-all shadow-glow hover:-translate-y-1">
                 Discover Gifts
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wishlist.map(product => (
                 <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-soft transition-all duration-300">
                    <Link href={`/product/${product.id}`} className="block relative aspect-square bg-surface-light overflow-hidden">
                       <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </Link>
                    <button 
                       onClick={() => removeFromWishlist(product.id)}
                       className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10 md:opacity-0 group-hover:opacity-100"
                    >
                       <Trash2 size={18} />
                    </button>
                    <div className="p-5">
                       <div className="text-xs font-semibold text-brand-accent uppercase tracking-wider mb-2">{product.category_name || 'Gift'}</div>
                       <Link href={`/product/${product.id}`} className="font-serif font-bold text-lg text-gray-900 line-clamp-1 hover:text-brand-primary transition-colors mb-2">
                          {product.title || product.name}
                       </Link>
                       <p className="text-xs text-gray-400 mb-4 line-clamp-1">By {product.shop_name || 'Verified Seller'}</p>
                       <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="font-bold text-brand-primary text-lg">₹{product.price}</span>
                          <Link href={`/product/${product.id}`} className="text-brand-accent hover:text-brand-dark font-medium text-sm flex items-center gap-1.5 transition-colors">
                            <ShoppingCart size={16} /> View
                          </Link>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}
