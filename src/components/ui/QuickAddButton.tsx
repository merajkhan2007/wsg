"use client";

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function QuickAddButton({ product, className }: { product: any, className?: string }) {
  const router = useRouter();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sizes = product.sizes ? product.sizes.split(',').filter(Boolean) : [];
    const colors = product.colors ? product.colors.split(',').filter(Boolean) : [];

    if (sizes.length > 0 || colors.length > 0) {
      toast('Please choose a variant first.', { icon: 'ℹ️' });
      router.push(`/product/${product.id}`);
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
        size: null,
        color: null
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
    window.dispatchEvent(new Event('cart_updated'));
  };

  return (
    <button 
      onClick={handleAdd}
      className={className || "pointer-events-auto bg-brand-primary/90 backdrop-blur-sm text-white px-4 py-2 w-full rounded-lg text-sm font-medium hover:bg-[#d63b63] transition-colors shadow-sm flex items-center justify-center gap-2"}
    >
      <ShoppingCart size={16} /> Add
    </button>
  );
}
