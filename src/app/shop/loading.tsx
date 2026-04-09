import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Search, Filter } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="w-full md:w-1/3 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 animate-pulse">
            <div className="relative flex-grow md:flex-grow-0">
              <div className="w-full md:w-64 h-10 bg-gray-200 rounded-full"></div>
            </div>
            <div className="relative">
               <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        
      </div>
    </div>
  );
}
