"use client";

import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AddToWishlistButton({ product }: { product: any }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWishlistState();
    // Listen for custom events across components
    const handleUpdate = () => checkWishlistState();
    window.addEventListener('wishlist_updated', handleUpdate);
    return () => window.removeEventListener('wishlist_updated', handleUpdate);
  }, [product?.id]);

  const checkWishlistState = async () => {
    if (!product || !product.id) {
       setLoading(false);
       return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const res = await fetch(`/api/customer/wishlist?product_id=${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsSaved(data.inWishlist);
        }
      } catch (err) {
        console.error('Failed to check wishlist', err);
      }
    } else {
      const existing = localStorage.getItem('wishlist');
      const wishlist = existing ? JSON.parse(existing) : [];
      setIsSaved(wishlist.some((item: any) => item.id === product.id));
    }
    setLoading(false);
  };

  const toggleWishlist = async () => {
    if (!product || !product.id) return;
    const token = localStorage.getItem('token');
    const newState = !isSaved;

    setIsSaved(newState);

    if (token) {
      try {
        if (newState) {
          const res = await fetch('/api/customer/wishlist', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ product_id: product.id })
          });
          if (!res.ok) setIsSaved(!newState); // Revert UI
        } else {
          const res = await fetch(`/api/customer/wishlist?product_id=${product.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) setIsSaved(!newState); // Revert UI
        }
      } catch (err) {
        console.error('Wishlist toggle error', err);
        setIsSaved(!newState); // Revert UI
      }
    } else {
      const existing = localStorage.getItem('wishlist');
      let wishlist = existing ? JSON.parse(existing) : [];
      
      let parsedImages: string[] = [];
      if (typeof product.images === 'string') {
        try { parsedImages = JSON.parse(product.images); } catch(e){}
      } else if (Array.isArray(product.images)) {
        parsedImages = product.images;
      }
      
      if (newState) {
        wishlist.push({
          id: product.id,
          name: product.title || product.name,
          price: product.price,
          image: parsedImages.length > 0 ? parsedImages[0] : (product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'),
          category_name: product.category_name || 'Gift',
          shop_name: product.shop_name || 'Seller'
        });
      } else {
        wishlist = wishlist.filter((item: any) => item.id !== product.id);
      }
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    window.dispatchEvent(new Event('wishlist_updated'));
  };

  if (loading) return (
    <button className="w-16 h-16 flex items-center justify-center bg-surface-light text-gray-300 rounded-full animate-pulse">
      <Heart size={24} />
    </button>
  );

  return (
    <button 
      onClick={toggleWishlist}
      className={`w-16 h-16 flex flex-shrink-0 items-center justify-center rounded-full transition-all ${
        isSaved 
          ? 'bg-brand-primary text-white shadow-glow' 
          : 'bg-surface-light text-gray-900 hover:bg-brand-accent hover:text-white'
      }`}
    >
      <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
}
