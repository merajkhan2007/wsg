"use client";

import { useEffect, useState } from 'react';
import { Settings, Save, Percent, Users, Shield, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States for new commission entry
  const [newSellerId, setNewSellerId] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/commissions', {
        headers: { 'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING' }
      });
      const data = await res.json();
      if (data.success) {
        setCommissions(data.commissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seller_id: parseInt(newSellerId, 10),
          percentage: parseFloat(newPercentage)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Commission saved successfully!', type: 'success' });
        setNewSellerId('');
        setNewPercentage('');
        fetchCommissions(); // refresh list
      } else {
        setMessage({ text: data.error || 'Failed to update commission', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 mt-2">Manage global configurations, roles, and seller commissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms & Configuration */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <Percent className="w-6 h-6 text-brand-teal" />
                    <h3 className="text-xl font-semibold text-gray-900">Custom Seller Commissions</h3>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSaveCommission} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seller ID</label>
                        <input 
                            type="number" 
                            required
                            value={newSellerId}
                            onChange={(e) => setNewSellerId(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commission Percentage (%)</label>
                        <input 
                            type="number" 
                            required
                            step="0.01"
                            min="0"
                            max="100"
                            value={newPercentage}
                            onChange={(e) => setNewPercentage(e.target.value)}
                            placeholder="e.g. 15.00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-6 py-3 bg-brand-teal hover:bg-teal-700 text-white rounded-xl font-medium transition-colors flex items-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                            {saving ? 'Saving...' : 'Apply Commission Rate'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-50 relative pointer-events-none">
                <div className="absolute inset-x-0 bottom-0 top-16 bg-gradient-to-t from-gray-50/80 to-transparent z-10"></div>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <Shield className="w-6 h-6 text-gray-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Role Management (Upcoming)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="h-12 bg-gray-100 rounded-xl"></div>
                     <div className="h-12 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        </div>

        {/* Info & Lists */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full max-h-[600px] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-brand-pink" /> Active Custom Rates
                </h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center p-8"><RefreshCw className="w-6 h-6 text-brand-teal animate-spin" /></div>
                    ) : commissions.length > 0 ? (
                        <ul className="space-y-4">
                            {commissions.map((comm: any) => (
                                <li key={comm.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center hover:border-brand-teal/30 hover:bg-brand-teal/10/50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-900 line-clamp-1">{comm.shop_name}</p>
                                        <p className="text-xs text-gray-500">Seller #{comm.seller_id}</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-white shadow-sm border border-gray-200 rounded-lg font-bold text-brand-teal">
                                        {comm.percentage}%
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center p-8 text-gray-500 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            No custom commission rates applied. The global default is standard.
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
