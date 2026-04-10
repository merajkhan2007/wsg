import { ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 p-4 bg-[#fdfbfb] border border-[#f5e6e8] rounded-2xl shadow-sm">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
          <ShieldCheck size={20} />
        </div>
        <span className="text-xs font-bold text-[#35434d] uppercase tracking-wide">100% Secure<br/>Payments</span>
      </div>
      
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Truck size={20} />
        </div>
        <span className="text-xs font-bold text-[#35434d] uppercase tracking-wide">Assured<br/>Delivery</span>
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
          <RefreshCcw size={20} />
        </div>
        <span className="text-xs font-bold text-[#35434d] uppercase tracking-wide">Easy<br/>Returns</span>
      </div>
    </div>
  );
}
