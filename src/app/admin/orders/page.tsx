"use client";

import { useEffect, useState } from 'react';
import { ShoppingBag, Box, Search, CheckCircle, Truck, PackageCheck, AlertCircle, MapPin, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string | number) => {
    try {
      setItemsLoading(true);
      const order = orders.find(o => o.id === orderId);
      if (order) setSelectedOrder(order);

      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.items) {
         setOrderItems(data.items);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder || !token) return;
    try {
      const btn = document.getElementById(`status-btn-${newStatus}`);
      if (btn) btn.innerHTML = 'Updating...';
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        alert(`Order forcefully marked as ${newStatus}`);
      } else {
        alert(data.error || 'Failed to update status');
      }
      if (btn) btn.innerHTML = newStatus === 'delivered' ? 'Force Delivered' : 'Cancel Order';
    } catch(err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
       case 'completed':
       case 'delivered': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
       case 'shipped': return 'text-brand-accent bg-brand-accent/10 border-brand-accent/20';
       case 'processing': return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
       case 'refunded':
       case 'cancelled': return 'text-red-500 bg-red-50 border-red-200';
       default: return 'text-amber-500 bg-amber-50 border-amber-200'; // pending
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Orders</h1>
            <p className="text-gray-500 mt-1">Monitor all platform orders, fulfillment status, and resolve issues.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Orders List */}
         <div className="bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 backdrop-blur-md sticky top-0 z-10">
               <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                     type="text" 
                     placeholder="Search order ID or customer..." 
                     className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all text-sm"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                 <div className="flex justify-center p-10"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-accent animate-spin"></div></div>
              ) : orders.length > 0 ? (
                 <ul className="divide-y divide-gray-100">
                    {orders.map((order) => (
                       <li key={order.id}>
                          <button 
                             onClick={() => loadOrderDetails(order.id)}
                             className={twMerge(
                                "w-full text-left p-4 hover:bg-gray-50/50 transition-colors border-l-2 border-transparent",
                                selectedOrder?.id === order.id && "bg-gray-50/80 border-brand-accent"
                             )}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono font-bold text-gray-500">#{String(order.id).padStart(4, '0')}</span>
                                <span className={clsx("px-2 py-0.5 rounded text-[10px] font-semibold border", getStatusColor(order.status))}>
                                   {order.status.toUpperCase()}
                                </span>
                             </div>
                             <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">{order.product_names || 'Products'}</h4>
                             <div className="flex justify-between items-end mt-2">
                                <span className="text-xs text-gray-400 max-w-[150px] truncate">for {order.customer_name} • {order.item_count} items</span>
                                <span className="text-sm font-bold text-brand-accent">₹{Number(order.total_amount).toFixed(2)}</span>
                             </div>
                          </button>
                       </li>
                    ))}
                 </ul>
              ) : (
                 <div className="p-10 text-center text-gray-400 text-sm">No recent orders.</div>
              )}
            </div>
         </div>

         {/* Order Details */}
         <div className="bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden lg:col-span-2 h-[calc(100vh-180px)] flex flex-col relative">
            {selectedOrder ? (
               <>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order #{String(selectedOrder.id).padStart(4, '0')}</h2>
                           <span className={clsx("px-2.5 py-1 rounded-md text-xs font-semibold border", getStatusColor(selectedOrder.status))}>
                               {selectedOrder.status}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                           <span className="text-gray-700 font-medium">{selectedOrder.customer_name}</span> • 
                           Placed {new Date(selectedOrder.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-start gap-1 mt-2">
                           <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                           <span className="max-w-md bg-gray-50/80 px-2 py-1 rounded border border-gray-100">{selectedOrder.address}</span>
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Order Total</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-600">
                           ₹{Number(selectedOrder.total_amount).toFixed(2)}
                        </p>
                     </div>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center">
                        <Box className="w-4 h-4 mr-2 text-gray-400" /> Fulfilled Items ({selectedOrder.item_count})
                     </h3>

                     {itemsLoading ? (
                        <div className="flex justify-center p-10"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-accent animate-spin"></div></div>
                     ) : (
                        <div className="bg-gray-50/30 rounded-2xl border border-gray-200 overflow-hidden">
                           <table className="w-full text-left text-sm">
                              <thead className="bg-gray-50/80 text-gray-500">
                                 <tr>
                                    <th className="px-4 py-3 font-medium">Product / Seller</th>
                                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                                    <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {orderItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                       <td className="px-4 py-4 max-w-[200px]">
                                          <div className="flex items-center gap-3">
                                             {item.image_url ? (
                                                <img src={item.image_url} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                             ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                   <ShoppingBag className="w-4 h-4 text-gray-300" />
                                                </div>
                                             )}
                                             <div>
                                                <p className="font-semibold text-gray-900 line-clamp-1">{item.product_name}</p>
                                                <p className="text-xs text-brand-accent font-medium">Sold by: {item.shop_name}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 text-center font-medium text-gray-700">x{item.quantity}</td>
                                       <td className="px-4 py-4 text-right font-medium text-gray-700">₹{Number(item.price).toFixed(2)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     )}
                     
                     {/* Override Action Bar */}
                     <div className="mt-8">
                        <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">Admin Status Overrides</h4>
                        <div className="flex gap-4">
                           {selectedOrder.status !== 'delivered' && (
                              <button 
                                 id="status-btn-delivered"
                                 onClick={() => handleUpdateStatus('delivered')}
                                 className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center border border-emerald-200 flex-col"
                               >
                                 <CheckCircle className="w-5 h-5 mb-1" /> Force Delivered
                              </button>
                           )}
                           {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'refunded' && (
                              <button 
                                 id="status-btn-cancelled"
                                 onClick={() => handleUpdateStatus('cancelled')}
                                 className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center border border-red-200 flex-col"
                               >
                                 <XCircle className="w-5 h-5 mb-1" /> Cancel Order
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                  <PackageCheck className="w-16 h-16 text-brand-accent/20 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">Select an Order</h3>
                  <p className="text-sm mt-2 max-w-sm">Choose an order from the global queue to view buyer details, track seller fulfillment, or forcefully override status.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
