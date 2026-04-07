"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function ProductGallery({ images, title }: { images: string[], title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImage = images[selectedIndex] || images[0];
  const thumbnails = images.length > 0 ? images.slice(0, 4) : [displayImage];

  return (
    <>
      <div className="space-y-4 relative">
        <div 
          className="aspect-square bg-surface-light rounded-3xl overflow-hidden shadow-soft relative group cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <Image 
            src={displayImage} 
            alt={title} 
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Zoom Overlay Hint */}
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300 drop-shadow-md" />
           </div>
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {thumbnails.map((imgSrc, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedIndex(idx)}
                className={twMerge(
                  "relative aspect-square bg-surface-light rounded-xl overflow-hidden cursor-pointer border-2 transition-colors",
                  selectedIndex === idx ? "border-brand-pink" : "border-transparent hover:border-brand-pink/50"
                )}
              >
                <Image src={imgSrc} alt={`thumbnail-${idx}`} fill className={twMerge("object-cover transition-opacity", selectedIndex === idx ? "opacity-100" : "opacity-70 hover:opacity-100")} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 animate-in fade-in duration-200" onClick={() => setIsZoomed(false)}>
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative w-full max-w-5xl aspect-square sm:aspect-auto sm:h-[80vh] bg-transparent cursor-zoom-out flex items-center justify-center" 
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
          >
            <div className="relative w-full h-full max-h-[90vh]">
              <Image 
                src={displayImage} 
                alt={title} 
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
