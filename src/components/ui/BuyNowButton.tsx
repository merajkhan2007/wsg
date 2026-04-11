"use client";

import { ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BuyNowButton({ product, selectedSize, selectedColor, hasSizes, hasColors }: { product: any, selectedSize?: string, selectedColor?: string, hasSizes?: boolean, hasColors?: boolean }) {
  const router = useRouter();

  const handleBuyNow = () => {
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size first.');
      return;
    }
    if (hasColors && !selectedColor) {
      toast.error('Please select a color first.');
      return;
    }
    const existing = localStorage.getItem('cart');
    let cart = existing ? JSON.parse(existing) : [];

    let parsedImages: string[] = [];
    if (typeof product.images === 'string') {
      try { parsedImages = JSON.parse(product.images); } catch(e){}
    } else if (Array.isArray(product.images)) {
      parsedImages = product.images;
    }

    const itemIndex = cart.findIndex((item: any) => 
      item.id === product.id && 
      item.size === (selectedSize || null) && 
      item.color === (selectedColor || null)
    );
    
    if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.title || product.name,
        price: product.special_price ? Number(product.special_price) : Number(product.price),
        quantity: 1,
        image: parsedImages.length > 0 ? parsedImages[0] : (product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'),
        size: selectedSize || null,
        color: selectedColor || null
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart_updated')); // Trigger navbar update if needed
    
    // Redirect securely to checkout
    router.push('/checkout');
  };

  return (
    <button 
      onClick={handleBuyNow}
      className="bg-[#f0a609] text-white flex items-center justify-center gap-2 py-3 px-8 rounded-full font-extrabold uppercase tracking-wide text-sm hover:bg-[#d99200] transition-colors shadow-sm"
    >
      <ShoppingBasket size={18} /> BUY NOW
    </button>
  );
}
