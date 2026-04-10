"use client";

import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddToCartButton({ product }: { product: any }) {
  const handleAddToCart = () => {
    const existing = localStorage.getItem('cart');
    let cart = existing ? JSON.parse(existing) : [];

    let parsedImages: string[] = [];
    if (typeof product.images === 'string') {
      try { parsedImages = JSON.parse(product.images); } catch(e){}
    } else if (Array.isArray(product.images)) {
      parsedImages = product.images;
    }

    const itemIndex = cart.findIndex((item: any) => item.id === product.id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.title || product.name,
        price: product.special_price ? Number(product.special_price) : Number(product.price),
        quantity: 1,
        image: parsedImages.length > 0 ? parsedImages[0] : (product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'),
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.title || product.name || 'Item'} added to cart!`, {
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #E94E77',
      },
      iconTheme: {
        primary: '#E94E77',
        secondary: '#fff',
      },
    });
    window.dispatchEvent(new Event('cart_updated')); // Trigger navbar update if needed
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-[#ff5a1f] text-white flex items-center justify-center gap-2 py-3 px-8 rounded-full font-extrabold uppercase tracking-wide text-sm hover:bg-[#e04a15] transition-colors shadow-sm"
    >
      <ShoppingCart size={18} /> ADD TO CART
    </button>
  );
}
