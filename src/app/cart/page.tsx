"use client";

import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = localStorage.getItem('cart');
    if (existing) setItems(JSON.parse(existing));
  }, []);

  const saveCart = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const updateQuantity = (id: number, size: string | null, color: string | null, delta: number) => {
    saveCart(items.map(item => 
      (item.id === id && item.size === size && item.color === color) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number, size: string | null, color: string | null) => {
    saveCart(items.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Your Cart ({items.length} items)</h1>

        {!mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-grow flex flex-col pt-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="flex gap-4 mt-auto">
                       <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                       <div className="h-10 bg-gray-200 rounded-full w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                <div className="h-14 bg-gray-200 rounded-full w-full mt-auto"></div>
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
             <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary text-4xl">
               🎁
             </div>
             <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is feeling light</h2>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">It's waiting to be filled with emotional and premium gifts for your loved ones.</p>
             <Link href="/shop" className="bg-brand-primary text-white px-8 py-3 rounded-full font-medium hover:bg-[#d63b63] transition-all">
                Continue Shopping
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center sm:items-start group hover:border-brand-primary/30 transition-colors">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  
                  <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                    {(item.size || item.color) && (
                      <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        {item.color && <span>Color: <strong>{item.color}</strong></span>}
                        {item.size && item.color && <span>|</span>}
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                      </div>
                    )}
                    <p className="text-brand-primary font-semibold text-lg mb-4">₹{item.price}</p>
                    
                    <div className="flex items-center gap-6 mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.size || null, item.color || null, -1)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size || null, item.color || null, 1)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button onClick={() => removeItem(item.id, item.size || null, item.color || null)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 py-4 border-t border-b border-gray-100 mb-8">
                  <span>Total</span>
                  <span className="text-brand-primary text-2xl">₹{total}</span>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-full font-medium text-lg hover:bg-[#d63b63] transition-colors shadow-glow">
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>
                
                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  🔒 Secure checkout with 256-bit encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
