import Link from 'next/link';
import Image from 'next/image';
import { query } from '@/lib/db';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';

async function getProducts() {
  try {
    const res = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC');
    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  const displayProducts = products;

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Our Collection</h1>
            <p className="text-gray-500">Explore gifts that create lasting memories</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search gifts..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-brand-primary hover:text-brand-primary transition-colors">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
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
                <div className="flex-1 flex flex-col">
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

      </div>
    </div>
  );
}
