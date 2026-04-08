"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const rawData = localStorage.getItem('user');
    if (!rawData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(rawData);

    fetch(`/api/orders/${params.id}`)
      .then(async res => {
         if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch order details');
         }
         return res.json();
      })
      .then(data => {
         // Security check: ensure the user only sees their own order
         if (data.user_id !== parsedUser.id) {
            setError('Unauthorized access to order');
         } else {
            setOrder(data);
         }
      })
      .catch(err => {
         setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-b-4 border-l-4 border-brand-accent animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-light flex flex-col items-center justify-center pt-10 px-4">
        <Search size={64} className="text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">{error || 'The order you are looking for does not exist or you do not have permission to view it.'}</p>
        <Link href="/dashboard/customer" className="bg-brand-accent text-white px-8 py-3 rounded-xl font-medium shadow-soft hover:bg-teal-700 transition flex items-center gap-2">
           <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Navigation */}
        <Link href="/dashboard/customer" className="inline-flex items-center text-gray-500 hover:text-brand-accent transition-colors font-medium mb-8">
           <ArrowLeft size={18} className="mr-2" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
           <div>
              <div className="flex items-center gap-4 mb-2">
                 <h1 className="text-3xl font-serif font-bold text-gray-900">Order #WSG-{String(order.id).padStart(4, '0')}</h1>
                 <span className={twMerge(
                    "px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider",
                    order.status === 'delivered' ? "bg-green-100 text-green-700" :
                    order.status === 'shipped' ? "bg-brand-accent/20 text-brand-accent" :
                    "bg-brand-primary/20 text-brand-primary"
                 )}>
                    {order.status}
                 </span>
              </div>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">
                 Placed on {new Date(order.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
           </div>
           <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{order.total_amount}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Items List */}
           <div className="md:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                 <Package className="w-5 h-5 text-brand-accent" /> Order Items
              </h3>
              
              <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                 {order.items && order.items.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                       {order.items.map((item: any) => (
                          <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-gray-50 transition-colors">
                             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100">
                                {item.product_image ? (
                                   <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                ) : (
                                   <Package className="w-8 h-8 text-gray-300" />
                                )}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.product_name || `Product ID: ${item.product_id}`}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                             </div>
                             <div className="text-right flex-shrink-0">
                                <p className="text-lg font-bold text-gray-900 mb-1">₹{item.price}</p>
                                <p className="text-xs text-brand-accent font-medium mt-1">₹{item.price * item.quantity} Total</p>
                             </div>
                          </li>
                       ))}
                    </ul>
                 ) : (
                    <div className="p-8 text-center text-gray-500">No items found for this order.</div>
                 )}
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                 <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-primary" /> Delivery Address
                 </h3>
                 <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                    <p className="font-medium text-gray-900 mb-2">Shipping To:</p>
                    <p className="whitespace-pre-line">{order.address}</p>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-brand-accent/10 to-transparent rounded-3xl p-6 border border-brand-accent/20">
                 <h3 className="text-base font-semibold text-brand-accent mb-2">Need Help?</h3>
                 <p className="text-sm text-gray-600 mb-4">Contact admin support for seller inquiries (privacy protected).</p>
                 <Link href="/dashboard/customer" className="w-full bg-brand-accent text-white font-medium px-4 py-2.5 rounded-xl uppercase tracking-wider text-xs hover:bg-teal-600 transition-all shadow-sm text-center block">
                    Contact Support
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
