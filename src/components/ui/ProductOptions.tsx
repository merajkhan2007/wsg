"use client";

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import BuyNowButton from './BuyNowButton';

export default function ProductOptions({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const colors = product.colors ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : [];

  return (
    <div className="w-full">
      {colors.length > 0 && (
        <div className="mb-6">
          <span className="font-extrabold text-[#111827] block mb-2">Color: <span className="font-medium text-gray-500">{selectedColor}</span></span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`border-[1.5px] px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedColor === color 
                    ? 'border-[#1d2b36] bg-[#1d2b36] text-white' 
                    : 'border-gray-200 text-gray-600 hover:border-[#1d2b36] hover:text-[#1d2b36]'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mb-6">
          <span className="font-extrabold text-[#111827] block mb-2">Size: <span className="font-medium text-gray-500">{selectedSize}</span></span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border-[1.5px] px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedSize === size 
                    ? 'border-[#1d2b36] bg-[#1d2b36] text-white' 
                    : 'border-gray-200 text-gray-600 hover:border-[#1d2b36] hover:text-[#1d2b36]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 w-full mt-2">
        <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} hasSizes={sizes.length > 0} hasColors={colors.length > 0} />
        <BuyNowButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} hasSizes={sizes.length > 0} hasColors={colors.length > 0} />
      </div>
    </div>
  );
}
