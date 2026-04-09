export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Skeleton */}
        <div className="flex space-x-2 mb-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="text-gray-300">/</div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="text-gray-300">/</div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Image Skeleton */}
          <div className="animate-pulse">
             <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-4"></div>
             <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
             </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col max-w-xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-full mb-2"></div>
            <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-6"></div>
            
            <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-8"></div>

            <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-md w-1/2 mb-6"></div>
            
            <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-10"></div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-4 mb-10">
               <div className="h-12 bg-gray-200 rounded-full w-40"></div>
               <div className="h-12 bg-gray-200 rounded-full w-40"></div>
            </div>

            {/* Description Skeleton */}
            <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
            <div className="space-y-3">
               <div className="h-4 bg-gray-200 rounded-md w-full"></div>
               <div className="h-4 bg-gray-200 rounded-md w-full"></div>
               <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
               <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
