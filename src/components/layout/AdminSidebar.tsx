"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Gift, 
  Ticket, 
  LogOut,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const adminLinks = [
  { name: 'Analytics', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Sellers & Payouts', href: '/admin/sellers', icon: Wallet },
  { name: 'Settings & Comm.', href: '/admin/settings', icon: Settings },
  { name: 'Coupons', href: '/admin/coupons', icon: Gift },
  { name: 'Support Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user_updated'));
    router.push('/login');
  };

  return (
    <div className="hidden lg:flex sticky top-20 h-[calc(100vh-80px)] w-64 flex-col bg-white border-r border-gray-100 shadow-soft">
      <div className="flex h-16 items-center px-6 border-b border-gray-100 flex-shrink-0">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">WeSoul Admin</span>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200'
              )}
            >
                <Icon
                  className={clsx(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
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
          className="group flex w-full items-center px-4 py-3 text-sm font-medium text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-100 border border-transparent transition-all"
        >
          <LogOut className="mr-3 h-5 w-5 text-rose-400 group-hover:text-rose-500" />
          Logout Securely
        </button>
      </div>
    </div>
  );
}
