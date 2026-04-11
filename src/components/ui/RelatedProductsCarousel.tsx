"use client";

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RelatedProductsCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">You May Also Like</h2>
        <div className="flex gap-2">
          <button 
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-primary hover:border-brand-primary transition-colors shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-primary hover:border-brand-primary transition-colors shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 lg:gap-8 pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((relProduct: any) => {
            let parsedImages: string[] = [];
            if (typeof relProduct.images === 'string') {
              try { parsedImages = JSON.parse(relProduct.images); } catch(e){}
            } else if (Array.isArray(relProduct.images)) {
              parsedImages = relProduct.images;
            }

            let displayImage = relProduct.image;
            if (parsedImages.length > 0) {
              displayImage = parsedImages[0];
            } else if (!displayImage) {
              displayImage = 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop';
            }

            return (
              <div 
                key={relProduct.id} 
                className="snap-start flex-none w-[160px] sm:w-[220px] lg:w-[calc(16.666%-1.5rem)] group flex flex-col bg-white p-3 rounded-[12px] shadow-sm border border-gray-50 hover:shadow-[0_8px_25px_rgba(233,78,119,0.12)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-xl mb-3 aspect-[4/5] bg-brand-base border border-gray-50">
                  <Link href={`/product/${relProduct.id}`} className="absolute inset-0 z-0">
                    <Image 
                      src={displayImage} 
                      alt={relProduct.title || relProduct.name || 'Product'} 
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <div className="absolute z-10 top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-600 shadow-sm pointer-events-none">
                    {relProduct.category_name || relProduct.category || 'Gifts'}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                    <Link href={`/product/${relProduct.id}`}>{relProduct.title || relProduct.name}</Link>
                  </h3>
                  <p className="text-brand-accent font-bold mt-auto pt-1 text-sm md:text-base">
                    ₹{relProduct.special_price ? relProduct.special_price : relProduct.price}
                    {Number(relProduct.special_price) < Number(relProduct.price) && (
                       <span className="text-xs text-gray-400 line-through ml-2 font-normal">₹{relProduct.price}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
