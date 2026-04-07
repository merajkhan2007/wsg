"use client";

import { useEffect, useState } from 'react';
import { ShoppingBag, Box, Search, CheckCircle, Truck, PackageCheck, AlertCircle, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      fetchOrders(t);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    if (!token) return;
    try {
      setItemsLoading(true);
      const res = await fetch(`/api/seller/orders?id=${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrderItems(data.items || []);
        setSelectedOrder(orders.find(o => String(o.id) === String(orderId)));
      } else {
        alert(data.error || 'Failed to load order details');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setItemsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
       case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
       case 'shipped': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
       case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
       default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20'; // pending
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder || !token) return;
    try {
      const btn = document.getElementById('status-btn');
      if (btn) btn.innerHTML = 'Updating...';
      const res = await fetch('/api/seller/orders', {
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
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch(err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;
    
    const totalAmount = orderItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice - Order #${selectedOrder.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #333; margin: 40px; }
            h1 { color: #f43f5e; margin-bottom: 5px; } /* brand-pink */
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background-color: #f9fafb; font-weight: 600; text-transform: uppercase; font-size: 12px; color: #666; }
            .total { font-weight: 700; font-size: 20px; margin-top: 20px; text-align: right; color: #f43f5e; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
               <h1>WeSoulGifts</h1>
               <p style="color: #666; margin-top: 0;">Seller Invoice</p>
            </div>
            <div style="text-align: right;">
               <p><strong>Order ID:</strong> #${selectedOrder.id.toString().padStart(4, '0')}</p>
               <p><strong>Date:</strong> ${new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>
          </div>
          <div class="details">
            <h2 style="font-size: 16px; text-transform: uppercase; color: #666;">Customer Details</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${selectedOrder.customer_name}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${selectedOrder.address}</p>
            <p style="margin: 5px 0;"><strong>Order Status:</strong> ${selectedOrder.status.toUpperCase()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr>
                  <td>
                    <strong>${item.product_name}</strong>
                    ${item.customization_data ? `<br><small style="color: #f43f5e;">Custom Request Included</small>` : ''}
                  </td>
                  <td>${item.quantity}</td>
                  <td>₹${Number(item.price).toFixed(2)}</td>
                  <td>₹${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Revenue: ₹${totalAmount.toFixed(2)}
          </div>
          <script>
            window.onload = function() { setTimeout(function(){ window.print(); }, 500); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups to download the invoice.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
             <ShoppingBag className="w-8 h-8 text-brand-pink" />
             Order Management
          </h1>
          <p className="text-gray-500 mt-2">Process fulfillment and track returns for your inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order List */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden lg:col-span-1 h-[calc(100vh-180px)] flex flex-col relative">
           <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent"></div>
           <div className="p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search order ID or customer..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:ring-1 focus:ring-brand-pink text-gray-800 outline-none text-sm transition-all placeholder:text-gray-400"
                />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {loading ? (
                <div className="flex justify-center p-10"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-pink animate-spin"></div></div>
             ) : orders.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                   {orders.map((order) => (
                      <li key={order.id}>
                         <button 
                            onClick={() => loadOrderDetails(order.id)}
                            className={twMerge(
                               "w-full text-left p-4 hover:bg-gray-50/50 transition-colors border-l-2 border-transparent",
                               selectedOrder?.id === order.id && "bg-gray-50/80 border-brand-pink"
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
                               <span className="text-xs text-gray-400 max-w-[150px] truncate">for {order.customer_name} • {order.seller_item_count} items</span>
                               <span className="text-sm font-bold text-brand-pink">₹{Number(order.seller_revenue).toFixed(2)}</span>
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
                           <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                           <span className="max-w-md bg-gray-50/80 px-2 py-1 rounded border border-gray-100">{selectedOrder.address}</span>
                        </p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-gray-400 mb-1">Your Earnings</p>
                       <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-teal">
                          ₹{Number(selectedOrder.seller_revenue).toFixed(2)}
                       </p>
                    </div>
                 </div>

                 {/* Items List */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest flex items-center">
                       <Box className="w-4 h-4 mr-2 text-gray-400" /> Line Items to Fulfill
                    </h3>

                    {itemsLoading ? (
                       <div className="flex justify-center p-10"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-pink animate-spin"></div></div>
                    ) : (
                       <div className="bg-gray-50/30 rounded-2xl border border-gray-200 overflow-hidden">
                          <table className="w-full text-left text-sm">
                             <thead className="bg-gray-50/80 text-gray-500">
                                <tr>
                                   <th className="px-4 py-3 font-medium">Product</th>
                                   <th className="px-4 py-3 font-medium text-center">Qty</th>
                                   <th className="px-4 py-3 font-medium text-right">Price</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200">
                                {orderItems.map((item) => (
                                   <tr key={item.order_item_id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-4 py-4">
                                         <div className="flex items-center gap-3">
                                            {item.image_url ? (
                                               <img src={item.image_url} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                                            ) : (
                                               <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                                                  <Box className="w-5 h-5 text-gray-400" />
                                               </div>
                                            )}
                                            <div>
                                               <p className="font-semibold text-gray-800">{item.product_name}</p>
                                               {item.customization_data && (
                                                  <div className="text-xs text-brand-pink mt-0.5 flex items-center">
                                                     <AlertCircle className="w-3 h-3 mr-1" /> Custom Request Attached
                                                  </div>
                                               )}
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
                    
                    {/* Action Bar */}
                    {selectedOrder.status !== 'completed' && selectedOrder.status !== 'refunded' && (
                       <div className="mt-8 flex gap-4">
                          {selectedOrder.status === 'shipped' ? (
                             <button 
                                id="status-btn"
                                onClick={() => handleUpdateStatus('delivered')}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-soft"
                              >
                                <CheckCircle className="w-5 h-5 mr-2" /> Mark as Delivered
                             </button>
                          ) : selectedOrder.status !== 'delivered' && (
                             <button 
                                id="status-btn"
                                onClick={() => handleUpdateStatus('shipped')}
                                className="flex-1 bg-brand-pink hover:bg-brand-pink/90 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center shadow-glow"
                              >
                                <Truck className="w-5 h-5 mr-2" /> Mark as Shipped
                             </button>
                          )}
                          <button 
                             onClick={handleDownloadInvoice}
                             className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-800 py-3 rounded-xl font-medium transition-colors flex items-center justify-center border border-gray-200"
                           >
                             Download Invoice
                          </button>
                       </div>
                    )}
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                 <PackageCheck className="w-16 h-16 text-brand-pink/20 mb-4" />
                 <h3 className="text-lg font-medium text-gray-700">Select an Order</h3>
                 <p className="text-sm mt-2 max-w-sm">Choose an order from the queue to view its contents, check custom gift requests, and manage fulfillment.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
