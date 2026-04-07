"use client";

import { useEffect, useState } from 'react';
import { Settings, User, Save, Image as ImageIcon, MapPin, Store } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellerSettingsPage() {
  const [profile, setProfile] = useState<any>({ 
     name: '', shop_name: '', shop_description: '', shop_logo: '',
     bank_name: '', bank_account_name: '', bank_account_number: '', bank_ifsc: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/settings', {
        headers: { 'Authorization': 'Bearer YOUR_SELLER_TOKEN_HERE' }
      });
      const data = await res.json();
      if (data.success) {
        setProfile({
            ...data.profile,
            shop_name: data.profile.shop_name || '',
            shop_description: data.profile.shop_description || '',
            name: data.profile.name || '',
            bank_name: data.profile.bank_name || '',
            bank_account_name: data.profile.bank_account_name || '',
            bank_account_number: data.profile.bank_account_number || '',
            bank_ifsc: data.profile.bank_ifsc || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
       const res = await fetch('/api/seller/settings', {
          method: 'PATCH',
          headers: { 
             'Authorization': 'Bearer YOUR_SELLER_TOKEN_HERE',
             'Content-Type': 'application/json' 
          },
          body: JSON.stringify(profile)
       });

       const data = await res.json();
       if (res.ok) {
          setMsg({ text: 'Bank details and Store profile saved successfully!', type: 'success' });
          setIsEditingBank(false);
       } else {
          setMsg({ text: data.error || 'Failed to update settings', type: 'error' });
       }
    } catch (err) {
       setMsg({ text: 'Unexpected error occurred', type: 'error' });
    } finally {
       setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[calc(100vh-100px)] items-center justify-center"><div className="w-10 h-10 rounded-full border-b-4 border-brand-teal border-l-4 animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
           <Settings className="w-8 h-8 text-brand-teal p-1 bg-brand-teal/10 rounded-lg border border-brand-teal/20" />
           Store Configuration
        </h1>
        <p className="text-gray-500 mt-2">Manage your public brand identity, logos, and personal info.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {msg.text && (
              <div className={twMerge("p-4 rounded-xl text-sm font-medium border", msg.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                 {msg.text}
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft">
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                  <Store className="w-5 h-5 mr-3 text-brand-teal" /> Public Store Profile
               </h3>
               
               <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="w-32 flex-shrink-0 flex flex-col items-center gap-3">
                     <div className="w-32 h-32 rounded-full border-4 border-gray-100 bg-gray-50/50 flex items-center justify-center overflow-hidden">
                        {profile.shop_logo ? (
                           <img src={profile.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                           <ImageIcon className="w-10 h-10 text-gray-400" />
                        )}
                     </div>
                     <button type="button" className="text-xs font-semibold text-brand-teal hover:text-brand-teal/80 transition-colors">Change Photo</button>
                  </div>

                  <div className="flex-1 space-y-6">
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                        <input 
                           type="text" 
                           value={profile.name}
                           onChange={(e) => setProfile({...profile, name: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Store Name</label>
                        <input 
                           type="text" 
                           value={profile.shop_name}
                           onChange={(e) => setProfile({...profile, shop_name: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900"
                        />
                        <p className="text-xs text-gray-400 mt-2">This is the brand name buyers will see on your product listings.</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Store Bio / Description</label>
                     <textarea 
                        rows={4}
                        value={profile.shop_description}
                        onChange={(e) => setProfile({...profile, shop_description: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 resize-none"
                     />
                  </div>
               </div>

               <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-3 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Bank Account Details
                     </h3>
                     <button 
                       type="button" 
                       onClick={() => setIsEditingBank(!isEditingBank)}
                       className={twMerge(
                         "text-xs font-bold px-3 py-1.5 rounded-lg border transition-all shadow-sm",
                         isEditingBank 
                           ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                           : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-brand-teal"
                       )}
                     >
                       {isEditingBank ? 'Cancel Edit' : 'Edit Details'}
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bank Name</label>
                        <input 
                           type="text" 
                           disabled={!isEditingBank}
                           value={profile.bank_name}
                           onChange={(e) => setProfile({...profile, bank_name: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 disabled:opacity-60 disabled:bg-gray-100/50 disabled:cursor-not-allowed"
                           placeholder="e.g. HDFC Bank"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Holder Name</label>
                        <input 
                           type="text" 
                           disabled={!isEditingBank}
                           value={profile.bank_account_name}
                           onChange={(e) => setProfile({...profile, bank_account_name: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 disabled:opacity-60 disabled:bg-gray-100/50 disabled:cursor-not-allowed"
                           placeholder="As per bank records"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Number</label>
                        <input 
                           type="text" 
                           disabled={!isEditingBank}
                           value={profile.bank_account_number}
                           onChange={(e) => setProfile({...profile, bank_account_number: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 disabled:opacity-60 disabled:bg-gray-100/50 disabled:cursor-not-allowed"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">IFSC Code</label>
                        <input 
                           type="text" 
                           disabled={!isEditingBank}
                           value={profile.bank_ifsc}
                           onChange={(e) => setProfile({...profile, bank_ifsc: e.target.value})}
                           className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 uppercase disabled:opacity-60 disabled:bg-gray-100/50 disabled:cursor-not-allowed"
                        />
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
                  <button 
                     type="submit" 
                     disabled={saving}
                     className="px-6 py-3 bg-brand-teal hover:bg-brand-teal/90 disabled:bg-gray-50 disabled:text-gray-400 text-white rounded-xl font-medium transition-colors flex items-center shadow-glow disabled:shadow-none"
                  >
                     <Save className="w-5 h-5 mr-2" />
                     {saving ? 'Saving Changes...' : 'Save Configuration'}
                  </button>
               </div>
            </form>
         </div>

         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft opacity-50 relative pointer-events-none">
               <div className="absolute inset-x-0 bottom-0 top-16 bg-gradient-to-t from-white/80 to-transparent z-10"></div>
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" /> Fulfillment Address
               </h3>
               <div className="space-y-4">
                  <div className="h-10 bg-gray-50/50 rounded-lg"></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="h-10 bg-gray-50/50 rounded-lg"></div>
                     <div className="h-10 bg-gray-50/50 rounded-lg"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
