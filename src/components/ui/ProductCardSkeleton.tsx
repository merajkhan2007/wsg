export default function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col animate-pulse">
      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[4/5] bg-gray-200">
      </div>
      <div className="flex-1 flex flex-col p-2">
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded-md w-1/3 mt-auto"></div>
      </div>
    </div>
  );
}
