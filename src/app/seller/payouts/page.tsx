"use client";

import { useEffect, useState } from 'react';
import { IndianRupee, ArrowUpRight, ArrowDownRight, RefreshCcw, CheckCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellerPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({ total_paid: 0, total_pending: 0, available_balance: 0 });
  const [loading, setLoading] = useState(true);
  const [requestAmount, setRequestAmount] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/seller/payouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(data.payouts || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    setMsg({ text: '', type: '' });

    try {
       const token = localStorage.getItem('token');
       const res = await fetch('/api/seller/payouts', {
          method: 'POST',
          headers: { 
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ amount: parseFloat(requestAmount) })
       });

       const data = await res.json();
       if (res.ok) {
          setMsg({ text: 'Payout requested. It will be reviewed shortly.', type: 'success' });
          setRequestAmount('');
          // Optimistically add to top of list
          setPayouts([data.payout, ...payouts]);
          setMetrics({ 
             ...metrics, 
             total_pending: parseFloat(metrics.total_pending) + parseFloat(data.payout.amount),
             available_balance: parseFloat(metrics.available_balance) - parseFloat(data.payout.amount)
          });
       } else {
          setMsg({ text: data.error || 'Failed to request payout', type: 'error' });
       }
    } catch (err) {
       setMsg({ text: 'Unexpected error occurred', type: 'error' });
    } finally {
       setRequesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
             <IndianRupee className="w-8 h-8 text-emerald-400 p-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20" />
             Earnings & Payouts
          </h1>
          <p className="text-gray-500 mt-2">Track generated revenue, pending settlements, and request withdrawals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Financial Overview Cards */}
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-soft relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-20"><IndianRupee className="w-24 h-24 text-emerald-500" /></div>
               <h3 className="text-sm font-semibold text-gray-500 mb-2 relative z-10">Cleared & Paid</h3>
               <p className="text-4xl font-bold text-emerald-400 relative z-10">₹{Number(metrics.total_paid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
               <div className="mt-4 flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full relative z-10 border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> Lifetime Earnings Transferred
               </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-soft relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-20"><Clock className="w-24 h-24 text-amber-500" /></div>
               <h3 className="text-sm font-semibold text-gray-500 mb-2 relative z-10">Pending Settlement</h3>
               <p className="text-4xl font-bold text-amber-400 relative z-10">₹{Number(metrics.total_pending).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
               <div className="mt-4 flex items-center text-xs font-medium text-amber-500 bg-amber-500/10 w-fit px-2.5 py-1 rounded-full relative z-10 border border-amber-500/20">
                  <RefreshCcw className="w-3 h-3 mr-1" /> Awaiting Admin Approval
               </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 border border-brand-teal/20 rounded-3xl p-6 shadow-soft relative overflow-hidden md:col-span-2 lg:col-span-3">
               <div className="absolute top-0 right-0 p-6 opacity-10"><IndianRupee className="w-32 h-32 text-brand-teal" /></div>
               <h3 className="text-sm font-semibold text-brand-teal mb-2 relative z-10">Total Available Balance</h3>
               <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-blue-600 relative z-10">
                   ₹{Number(metrics.available_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </p>
               <div className="mt-4 flex items-center text-xs font-medium text-brand-teal bg-brand-teal/10 w-fit px-2.5 py-1 rounded-full relative z-10 border border-brand-teal/20">
                  Ready to be withdrawn immediately
               </div>
            </div>
         </div>

         {/* Withdrawal Form */}
         <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft lg:col-span-1 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Request Withdrawal</h3>
            
            {msg.text && (
              <div className={twMerge("p-3 rounded-xl mb-6 text-xs font-medium border", msg.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                 {msg.text}
              </div>
            )}

            <form onSubmit={handleRequestPayout}>
               <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount to Withdraw (₹)</label>
               <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    type="number"
                    required
                    min="100"
                    max={metrics.available_balance > 0 ? metrics.available_balance : 0}
                    step="0.01"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-900 font-mono"
                  />
                  {metrics.available_balance <= 0 && (
                     <p className="text-[10px] text-red-500 mt-2 font-medium">Insufficient available balance for withdrawal.</p>
                  )}
               </div>
               
               <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-xs mb-2">
                     <span className="text-gray-500">Platform Commission Fee</span>
                     <span className="text-gray-700">Auto-deducted</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                     <span className="text-gray-500">Processing Time</span>
                     <span className="text-amber-400">1-3 Business Days</span>
                  </div>
               </div>

                  <button 
                  type="submit" 
                  disabled={requesting || !requestAmount || parseFloat(requestAmount) > metrics.available_balance || metrics.available_balance < 100}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl py-3 font-semibold transition-colors flex justify-center items-center shadow-glow disabled:shadow-none"
               >
                  {requesting ? 'Processing...' : 'Submit Request'}
               </button>
            </form>
         </div>

         {/* Payout History */}
         <div className="bg-white border border-gray-100 rounded-3xl p-0 shadow-soft lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-white/50 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            </div>
            
            <div className="overflow-x-auto flex-1 p-6 pt-0">
               <table className="w-full text-left mt-4 border-separate border-spacing-y-3">
                  <thead>
                     <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="px-4 pb-2 font-medium">Transaction ID</th>
                        <th className="px-4 pb-2 font-medium">Requested On</th>
                        <th className="px-4 pb-2 font-medium">Amount</th>
                        <th className="px-4 pb-2 font-medium text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan={4} className="py-10 text-center"><div className="w-6 h-6 border-b-2 border-emerald-500 rounded-full animate-spin inline-block"></div></td></tr>
                     ) : payouts.length > 0 ? (
                        payouts.map((p) => (
                           <tr key={p.id} className="bg-gray-50/30 group hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-4 rounded-l-xl font-mono text-xs text-gray-500">PY-{p.id.toString().padStart(6, '0')}</td>
                              <td className="px-4 py-4 text-sm text-gray-700">{new Date(p.created_at).toLocaleDateString()}</td>
                              <td className="px-4 py-4 font-bold text-gray-900">₹{Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-4 py-4 rounded-r-xl text-right">
                                 {p.status === 'paid' || p.status === 'completed' ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                       <CheckCircle className="w-3 h-3 mr-1" /> PAID
                                    </span>
                                 ) : p.status === 'pending' ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                       <Clock className="w-3 h-3 mr-1" /> PENDING
                                    </span>
                                 ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                       REJECTED
                                    </span>
                                 )}
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm bg-gray-50/20 rounded-xl border border-dashed border-gray-200">No payout requests found yet.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
    </div>
  );
}
