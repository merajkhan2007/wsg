"use client";

import { useEffect, useState } from 'react';
import { Truck, Map, Globe, CheckCircle, Save, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellerShippingPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Form states
  const [newZoneName, setNewZoneName] = useState('');
  const [newRegions, setNewRegions] = useState('');
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/shipping', {
        headers: { 'Authorization': 'Bearer YOUR_SELLER_TOKEN_HERE' }
      });
      const data = await res.json();
      if (data.success) {
        setZones(data.shipping_zones || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      // Assuming regions is comma separated
      const regionArray = newRegions.split(',').map(r => r.trim()).filter(Boolean);

      const res = await fetch('/api/seller/shipping', {
        method: 'POST',
        headers: { 
           'Authorization': 'Bearer YOUR_SELLER_TOKEN_HERE',
           'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          zone_name: newZoneName,
          regions: regionArray,
          base_rate: parseFloat(newRate)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Shipping zone added successfully!', type: 'success' });
        setNewZoneName('');
        setNewRegions('');
        setNewRate('');
        fetchZones();
      } else {
        setMsg({ text: data.error || 'Failed to add zone', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Unexpected error occurred', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
           <Truck className="w-8 h-8 text-brand-teal p-1 bg-brand-teal/10 rounded-lg border border-brand-teal/20" />
           Shipping Rates & Zones
        </h1>
        <p className="text-gray-500 mt-2">Define geographic rules and base rates for worldwide or localized fulfillment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Zones Dashboard */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-soft lg:col-span-1 h-fit">
           <div className="px-6 py-5 border-b border-gray-100 bg-white/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                 <Globe className="w-5 h-5 mr-3 text-brand-teal" /> Active Shipping Ecosystem
              </h3>
              <span className="text-xs font-bold bg-gray-50 text-gray-700 px-3 py-1 rounded-full">{zones.length} Zones</span>
           </div>
           
           <div className="p-6">
              {loading ? (
                 <div className="flex justify-center p-10"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-teal animate-spin"></div></div>
              ) : zones.length > 0 ? (
                 <div className="space-y-4">
                    {zones.map((zone) => (
                       <div key={zone.id} className="p-5 bg-gray-50/30 border border-gray-200 rounded-2xl hover:bg-gray-50/50 transition-colors group relative">
                          <button className="absolute top-4 right-4 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X className="w-5 h-5" />
                          </button>
                          
                          <div className="flex justify-between items-start mb-3 pr-8">
                             <h4 className="font-bold text-gray-900 text-lg tracking-tight">{zone.zone_name}</h4>
                             <span className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-3 py-1 rounded-lg font-mono text-sm font-bold shadow-sm">
                                ₹{Number(zone.base_rate).toFixed(2)}
                             </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                             {zone.regions?.map((region: string, idx: number) => (
                                <span key={idx} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-200">
                                   {region}
                                </span>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="p-10 text-center flex flex-col items-center">
                    <Map className="w-12 h-12 text-brand-teal/20 mb-4" />
                    <p className="text-gray-400 font-medium">No custom shipping zones assigned.</p>
                    <p className="text-xs text-gray-400 mt-1">Global platform default rates will apply to your orders.</p>
                 </div>
              )}
           </div>
        </div>

        {/* Add Zone Wizard */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft lg:col-span-1 h-fit relative">
           <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent"></div>
           <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
              <Plus className="w-5 h-5 mr-3 text-brand-teal" /> Create Shipping Profile
           </h3>
           
           {msg.text && (
             <div className={twMerge("p-3 rounded-xl mb-6 text-xs font-medium border", msg.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                {msg.text}
             </div>
           )}

           <form onSubmit={handleAddZone} className="space-y-6">
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Internal Zone Name</label>
                 <input 
                    type="text"
                    required
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder="e.g. Domestic Priority, European Union"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 placeholder:text-gray-400"
                 />
              </div>
              
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Assigned Regions (Comma Separated)</label>
                 <input 
                    type="text"
                    required
                    value={newRegions}
                    onChange={(e) => setNewRegions(e.target.value)}
                    placeholder="e.g. India, USA, Canada"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 placeholder:text-gray-400"
                 />
              </div>
              
              <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Base Restocking/Shipping Rate (₹)</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input 
                       type="number"
                       required
                       min="0"
                       step="0.01"
                       value={newRate}
                       onChange={(e) => setNewRate(e.target.value)}
                       placeholder="0.00"
                       className="w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-gray-900 placeholder:text-gray-400 font-mono"
                    />
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                 <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90 disabled:bg-gray-50 disabled:text-gray-400 text-white rounded-xl py-3 font-semibold transition-colors flex justify-center items-center shadow-glow disabled:shadow-none"
                 >
                    {saving ? 'Binding to System...' : 'Bind Zone Configuration'}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
