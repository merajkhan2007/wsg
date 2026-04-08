"use client";

import { useEffect, useState } from 'react';
import { Gift, Plus, Calendar, Tag, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Coupon Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [value, setValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formMsg, setFormMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/coupons', {
        headers: { 'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING' }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discount_type: discountType,
          value: parseFloat(value),
          expiry_date: new Date(expiryDate).toISOString(),
          is_active: isActive
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormMsg({ text: 'Coupon created successfully!', type: 'success' });
        // Reset form
        setCode('');
        setValue('');
        setExpiryDate('');
        setIsActive(true);
        fetchCoupons(); // Refresh table
      } else {
        setFormMsg({ text: data.error || 'Failed to create coupon', type: 'error' });
      }
    } catch (err) {
      setFormMsg({ text: 'Unexpected error occurred', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Marketing & Coupons</h1>
        <p className="text-gray-500 mt-2">Create global platform discounts or assist sellers with specific codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-1 h-fit">
           <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
             <Plus className="w-5 h-5 mr-2 text-brand-primary" /> New Coupon
           </h3>

           {formMsg.text && (
             <div className={twMerge("p-3 rounded-xl mb-4 text-xs font-medium", formMsg.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100")}>
               {formMsg.text}
             </div>
           )}

           <form onSubmit={handleCreateCoupon} className="space-y-5">
              <div>
                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Coupon Code</label>
                 <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SUMMER25"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-mono text-sm uppercase"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Discount Type</label>
                 <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setDiscountType('percentage')}
                      className={twMerge("flex-1 text-sm py-1.5 rounded-lg font-medium transition-colors", discountType === 'percentage' ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}
                    >Percentage (%)</button>
                    <button 
                      type="button"
                      onClick={() => setDiscountType('fixed')}
                      className={twMerge("flex-1 text-sm py-1.5 rounded-lg font-medium transition-colors", discountType === 'fixed' ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}
                    >Fixed Amount (₹)</button>
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Value</label>
                 <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                 />
              </div>

              <div>
                 <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Expiry Date</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="datetime-local" 
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                    />
                 </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                 <button 
                   type="button"
                   onClick={() => setIsActive(!isActive)}
                   className={twMerge("relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", isActive ? "bg-emerald-500" : "bg-gray-200")}
                 >
                    <span aria-hidden="true" className={twMerge("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", isActive ? "translate-x-5" : "translate-x-0")}></span>
                 </button>
                 <span className="text-sm font-medium text-gray-700">Set Active on Creation</span>
              </div>

              <button 
                 type="submit" 
                 disabled={submitting}
                 className="w-full mt-4 bg-brand-primary hover:bg-[#d6517a] text-white rounded-xl py-3 font-semibold transition-colors shadow-md disabled:opacity-70 flex justify-center items-center"
              >
                 {submitting ? 'Generating...' : <><Gift className="w-4 h-4 mr-2" /> Generate Code</>}
              </button>
           </form>
        </div>

        {/* List View */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
           <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
             <Gift className="w-5 h-5 mr-2 text-brand-primary" /> Active Promotions
           </h3>
           
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                   <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Discount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expiry Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                   {loading ? (
                     <tr><td colSpan={4} className="py-10 text-center"><div className="w-6 h-6 border-b-2 border-brand-primary rounded-full animate-spin inline-block"></div></td></tr>
                   ) : coupons.length > 0 ? (
                     coupons.map((c: any) => (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-4 py-4 whitespace-nowrap">
                              <span className="bg-gray-100 text-gray-800 font-mono px-2.5 py-1 rounded text-sm font-semibold border border-gray-200">{c.code}</span>
                              {c.shop_name && <p className="text-[10px] text-gray-500 mt-1">Bound to: {c.shop_name}</p>}
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                              {c.discount_type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                              {new Date(c.expiry_date).toLocaleDateString()}
                              {new Date(c.expiry_date) < new Date() && <span className="ml-2 text-red-500 font-medium">(Expired)</span>}
                           </td>
                           <td className="px-4 py-4 whitespace-nowrap text-right">
                              {c.is_active ? 
                                <span className="inline-flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3 mr-1" /> Active</span> 
                                : 
                                <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3 mr-1" /> Disabled</span>
                              }
                           </td>
                        </tr>
                     ))
                   ) : (
                     <tr><td colSpan={4} className="py-10 text-center text-gray-500 text-sm">No coupons generated yet.</td></tr>
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
