"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Search, Wallet, Store, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellersPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sellers' | 'payouts'>('sellers');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    Promise.all([
      fetch('/api/admin/payouts', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('/api/admin/sellers', { headers: { 'Authorization': `Bearer ${token}` } })
    ])
      .then(async ([res1, res2]) => {
         const json1 = await res1.json();
         const json2 = await res2.json();
         if (json1.success) setPayouts(json1.payouts || []);
         if (Array.isArray(json2)) setSellers(json2);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    if (status === 'rejected') {
       if (!window.confirm("Are you sure you want to cancel this payout request?")) return;
    }
    if (status === 'completed') {
       if (!window.confirm("Are you sure you want to mark this payout as PAID? This cannot be undone.")) return;
    }
    
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/payouts?id=${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
        setPayouts(payouts.map((p: any) => p.id === id ? { ...p, status } : p));
    }
  };

  const handleSellerApproval = async (id: number, action: 'approve' | 'reject') => {
    if (action === 'reject') {
       if (!window.confirm("Are you sure you want to suspend or reject this seller? Their products will no longer be available.")) return;
    }
    
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/sellers?id=${id}&action=${action}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
        setSellers(sellers.map((s: any) => s.id === id ? { ...s, approval_status: action === 'approve' ? 'approved' : 'rejected' } : s));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sellers & Payouts</h1>
          <p className="text-gray-500 mt-2">Manage seller accounts, verify businesses, and process payouts.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search sellers by name..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none shadow-sm w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-100">
         <button 
           onClick={() => setActiveTab('sellers')}
           className={twMerge("px-4 py-4 font-medium text-sm transition-colors border-b-2", activeTab === 'sellers' ? "border-brand-accent text-brand-accent" : "border-transparent text-gray-500 hover:text-gray-700")}
         >
           Registered Sellers
         </button>
         <button 
           onClick={() => setActiveTab('payouts')}
           className={twMerge("px-4 py-4 font-medium text-sm transition-colors border-b-2", activeTab === 'payouts' ? "border-brand-accent text-brand-accent" : "border-transparent text-gray-500 hover:text-gray-700")}
         >
           Payout Requests
         </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden">
        {loading ? (
             <div className="p-12 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-brand-accent border-t-transparent animate-spin"></div></div>
        ) : activeTab === 'payouts' ? (
          payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller Details</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount requested</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {payouts.map((payout: any) => (
                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center font-bold">
                            {payout.shop_name?.charAt(0) || 'S'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{payout.shop_name}</div>
                            <div className="text-xs text-brand-accent font-medium mt-0.5">ID: {payout.seller_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">₹{Number(payout.amount).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "px-2.5 py-1 inline-flex text-xs font-semibold rounded-md border",
                          payout.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                          payout.status === 'rejected' ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"
                        )}>
                          {payout.status === 'completed' ? <CheckCircle className="w-4 h-4 mr-1.5" /> : 
                           payout.status === 'rejected' ? <XCircle className="w-4 h-4 mr-1.5" /> : <Clock className="w-4 h-4 mr-1.5" />}
                          {payout.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {payout.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => handleStatusChange(payout.id, 'completed')}
                               className="bg-brand-accent text-white hover:bg-brand-accent/90 px-3 py-1.5 rounded-lg inline-flex items-center shadow-sm transition-colors text-xs"
                             >
                                <Wallet className="w-4 h-4 mr-1.5"/> Mark Paid
                             </button>
                             <button 
                               onClick={() => handleStatusChange(payout.id, 'rejected')}
                               className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg inline-flex items-center shadow-sm transition-colors text-xs border border-red-200"
                             >
                                <XCircle className="w-4 h-4 mr-1.5"/> Cancel
                             </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
               <Wallet className="w-12 h-12 text-gray-300 mb-3" />
               <p className="text-sm">No payout requests found.</p>
            </div>
          )
        ) : (
          sellers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner / Contact</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business & Bank Details</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {sellers.map((seller: any) => (
                    <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-brand-accent/10 text-brand-accent rounded-xl flex items-center justify-center font-bold">
                            <Store className="w-5 h-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{seller.shop_name}</div>
                            <div className="text-xs text-gray-500 font-medium mt-0.5">Joined {new Date(seller.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{seller.name}</div>
                        <div className="text-xs text-gray-500">{seller.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono mb-1">{seller.business_registration_number || 'No Reg. ID'}</div>
                        {seller.bank_name ? (
                           <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                              <span className="font-semibold text-brand-accent">{seller.bank_name}</span>
                              <span className="font-mono tracking-tight">{seller.bank_account_number}</span>
                              <span>IFSC: <span className="uppercase">{seller.bank_ifsc}</span></span>
                           </div>
                        ) : (
                           <span className="text-xs text-rose-400 italic">No bank info added</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-emerald-600">
                           ₹{Number(seller.available_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "px-2.5 py-1 inline-flex text-xs font-semibold rounded-md border",
                          seller.approval_status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                          seller.approval_status === 'rejected' ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"
                        )}>
                          {seller.approval_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {seller.approval_status !== 'approved' && (
                            <button 
                              onClick={() => handleSellerApproval(seller.id, 'approve')}
                              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg inline-flex items-center shadow-sm transition-colors text-xs font-bold border border-emerald-200"
                            >
                               <CheckCircle className="w-4 h-4 mr-1.5"/> Approve
                            </button>
                          )}
                          {seller.approval_status !== 'rejected' && (
                            <button 
                              onClick={() => handleSellerApproval(seller.id, 'reject')}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg inline-flex items-center shadow-sm transition-colors text-xs font-bold border border-red-200"
                            >
                               <XCircle className="w-4 h-4 mr-1.5"/> {seller.approval_status === 'approved' ? 'Suspend' : 'Reject'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
               <Store className="w-12 h-12 text-gray-300 mb-3" />
               <p className="text-sm">No sellers registered yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
