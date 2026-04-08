"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ShopContent({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'All';
  const defaultBrand = searchParams.get('brand') || 'All';
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [activeBrand, setActiveBrand] = useState<string>(defaultBrand);
  
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
    setActiveBrand(searchParams.get('brand') || 'All');
  }, [searchParams]);

  const categories = useMemo(() => {
     const cats = new Set(initialProducts.map(p => p.category_name).filter(Boolean));
     return ['All', ...Array.from(cats)];
  }, [initialProducts]);

  const displayProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = (product.title || product.name || '').toLowerCase().includes(search.toLowerCase()) ||
                            (product.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || 
          (product.category_name && product.category_name.toLowerCase() === activeCategory.toLowerCase());
      const matchesBrand = activeBrand === 'All' ||
          (product.shop_name && product.shop_name.toLowerCase() === activeBrand.toLowerCase());

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [initialProducts, search, activeCategory, activeBrand]);

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 capitalize">
              {activeBrand !== 'All' ? `${activeBrand}'s Collection` : (activeCategory === 'All' ? 'Our Collection' : activeCategory)}
            </h1>
            <p className="text-gray-500">Explore gifts that create lasting memories</p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gifts..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-gray-800"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-2 pr-10 focus:outline-none focus:border-brand-primary text-gray-700 cursor-pointer shadow-sm hover:border-brand-primary transition-colors"
              >
                {categories.map((c: any) => (
                   <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <Filter size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {displayProducts.map((product) => {
              let parsedImages: string[] = [];
              if (typeof product.images === 'string') {
                try { parsedImages = JSON.parse(product.images); } catch(e){}
              } else if (Array.isArray(product.images)) {
                parsedImages = product.images;
              }

              let displayImage = product.image;
              if (parsedImages.length > 0) {
                displayImage = parsedImages[0];
              } else if (!displayImage) {
                displayImage = 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop';
              }

              return (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 aspect-[4/5] bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                    <Link href={`/product/${product.id}`}>
                      <Image 
                        src={displayImage} 
                        alt={product.title || product.name || 'Product Image'} 
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                      <button className="bg-brand-primary/90 backdrop-blur-sm text-white px-4 py-2 w-full rounded-lg text-xs md:text-sm font-medium hover:bg-[#d63b63] transition-colors shadow-sm flex items-center justify-center gap-2">
                        <ShoppingCart size={16} /> Add
                      </button>
                    </div>
                    <button className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-brand-primary hover:bg-white transition-all shadow-sm">
                      <Heart size={16} />
                    </button>
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-600 shadow-sm">
                      {product.category_name || 'Gifts'}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white/50 p-2 rounded-xl">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                      <Link href={`/product/${product.id}`}>{product.title || product.name}</Link>
                    </h3>
                    <p className="text-gray-900 font-bold mt-auto pt-1 text-sm md:text-base">
                      ₹{product.special_price ? product.special_price : product.price}
                      {Number(product.special_price) < Number(product.price) && (
                         <span className="text-xs text-gray-400 line-through ml-2 font-normal">₹{product.price}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1">Try adjusting your search criteria</p>
            <button 
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveBrand('All'); }}
              className="mt-6 text-brand-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
