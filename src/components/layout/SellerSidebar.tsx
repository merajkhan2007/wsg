"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  Truck, 
  Settings, 
  MessageSquare,
  Repeat,
  Wallet,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

export const sellerLinks = [
  { name: 'Dashboard Analytics', href: '/seller/dashboard', icon: BarChart3 },
  { name: 'Products & Inventory', href: '/seller/products', icon: Package },
  { name: 'Orders & Returns', href: '/seller/orders', icon: Repeat },
  { name: 'Shipping Zones', href: '/seller/shipping', icon: Truck },
  { name: 'Customer Chat', href: '/seller/messages', icon: MessageSquare },
  { name: 'Earnings & Payouts', href: '/seller/payouts', icon: Wallet },
  { name: 'Store Settings', href: '/seller/settings', icon: Settings },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user_updated'));
    router.push('/login');
  };

  return (
    <div className="hidden lg:flex sticky top-20 h-[calc(100vh-80px)] w-64 flex-col bg-white border-r border-gray-100 shadow-sm relative overflow-y-auto">
      <div className="flex h-16 items-center px-6 border-b border-gray-50 flex-shrink-0">
        <span className="text-xl font-bold bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">weSoulgifts Seller</span>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {sellerLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out',
                isActive
                  ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20 shadow-glow'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200 border border-transparent'
              )}
            >
                <Icon
                  className={clsx(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-brand-accent' : 'text-gray-400 group-hover:text-gray-700'
                  )}
                  aria-hidden="true"
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="group flex w-full items-center px-4 py-3 text-sm font-medium text-rose-400 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all"
        >
          <LogOut className="mr-3 h-5 w-5 text-rose-500/70 group-hover:text-rose-400" />
          Logout Terminal
        </button>
      </div>
    </div>
  );
}
