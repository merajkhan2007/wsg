import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/ui/AddToCartButton';
import AddToWishlistButton from '@/components/ui/AddToWishlistButton';
import BuyNowButton from '@/components/ui/BuyNowButton';
import ProductGallery from '@/components/ui/ProductGallery';

async function getProduct(id: string) {
  try {
    const res = await query('SELECT p.*, c.name as category_name, s.shop_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string | null, currentProductId: string) {
  if (!categoryId) return [];
  try {
    const res = await query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = $1 AND p.id != $2 ORDER BY random() LIMIT 4',
      [categoryId, currentProductId]
    );
    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  let product = await getProduct(params.id);
  let relatedProducts = product ? await getRelatedProducts(product.category_id, product.id) : [];

  if (!product) {
    notFound();
  }

  let parsedImages: string[] = [];
  if (typeof product.images === 'string') {
    try { parsedImages = JSON.parse(product.images); } catch(e){}
  } else if (Array.isArray(product.images)) {
    parsedImages = product.images;
  }
  
  if (parsedImages.length === 0) {
    parsedImages = ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop'];
  }

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-sm font-medium text-gray-500 mb-8 flex space-x-2">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title || product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Image */}
          <ProductGallery images={parsedImages} title={product.title || product.name || 'Product'} />

          {/* Product Info */}
          <div className="flex flex-col font-sans max-w-xl">
            <h1 className="text-[22px] md:text-[26px] font-extrabold uppercase text-[#35434d] mb-6 leading-tight">
              {product.title || product.name || 'HANDPAINTED LIPPAN ART PICHWAI COW WALL HANGING'}
            </h1>
            
            {(() => {
              const mrp = Number(product.price);
              const sellingPrice = product.special_price ? Number(product.special_price) : mrp;
              const hasDiscount = sellingPrice < mrp;
              const savings = mrp - sellingPrice;
              const percentage = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
              
              return (
                <>
                  <div className="mb-1 text-lg">
                     <span className="font-extrabold text-[#111827]">{hasDiscount ? 'Special Price:' : 'Price:'}</span>
                     <span className="text-[22px] font-bold text-[#35434d] ml-1">₹{sellingPrice}</span>
                  </div>
                  {hasDiscount && (
                    <>
                      <div className="mb-2 text-[15px]">
                        <span className="font-extrabold text-[#111827]">MRP:</span>
                        <span className="text-gray-400 line-through ml-1">₹{mrp}</span>
                      </div>
                      <div className="mb-3 text-[15px]">
                        <span className="font-extrabold text-[#111827]">Savings:</span>
                        <span className="text-[#10b981] font-bold ml-1">₹{savings} ({percentage}%)</span>
                      </div>
                    </>
                  )}
                </>
              );
            })()}

            <div className="text-[#10b981] font-bold mb-2 text-[17px]">In Stock</div>

            <div className="flex items-center gap-2 mb-4">
               <span className="font-extrabold text-[#111827]">Size:</span>
               <span className="border-[1.5px] border-[#1d2b36] px-5 py-1.5 text-xs font-bold text-[#1d2b36] uppercase tracking-wider">REGULAR</span>
            </div>

            <div className="mb-2 text-[15px]">
               <span className="font-extrabold text-[#111827]">Brand:</span>
               <span className="text-[#35434d] ml-1">{product.shop_name || 'Creative Corner'}</span>
            </div>

            <div className="mb-8 text-[15px]">
               <span className="font-extrabold text-[#111827]">Delivered By:</span>
               <span className="text-[#35434d] ml-1 flex-1">Apr 12 - Apr 22</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-10 w-full">
               <AddToCartButton product={product} />
               <BuyNowButton product={product} />
            </div>

            {/* DESCRIPTION */}
            <h2 className="text-[22px] font-extrabold uppercase text-[#111827] mb-4">DESCRIPTION</h2>
            <div className="text-[#35434d] leading-relaxed text-base space-y-6 whitespace-pre-wrap">
               {product.description || "Material: MDF\n\nSize : 10 inches\n\nCare: Clean with a soft dry cloth\n\nUse : Traditional and auspicious wall hanging to enhance the beauty of your sacred place"}
            </div>

            <div className="mt-8 flex justify-start">
               <AddToWishlistButton product={product} />
            </div>
          </div>

        </div>
      </div>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-gray-100">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((relProduct: any) => {
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
                <div key={relProduct.id} className="group flex flex-col bg-white p-3 rounded-[12px] shadow-sm border border-gray-50 hover:shadow-[0_8px_25px_rgba(233,78,119,0.12)] transition-all duration-300 transform hover:-translate-y-1">
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
      )}
    </div>
  );
}
