"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  IndianRupee,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { total_users: 0, total_sellers: 0, total_orders: 0, total_revenue: 0 },
    revenueOverTime: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetch('/api/admin/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
         if (json.success) setData(json);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-brand-teal border-t-transparent animate-spin"></div></div>;

  const statCards = [
    { title: 'Total Revenue', value: `₹${Number(data.stats.total_revenue).toFixed(2)}`, icon: IndianRupee, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Total Orders', value: data.stats.total_orders, icon: ShoppingBag, color: 'bg-brand-teal/10 text-brand-teal' },
    { title: 'Total Users', value: data.stats.total_users, icon: Users, color: 'bg-brand-pink/10 text-brand-pink' },
    { title: 'Active Sellers', value: data.stats.total_sellers, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  +12.5% <ArrowUpRight className="w-4 h-4 ml-1" />
                </span>
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Analytics</h3>
          <div className="h-80 w-full">
            {data.revenueOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No revenue data yet (need active orders)</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
          <div className="h-80 w-full">
             {data.topProducts.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <YAxis type="category" dataKey="title" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} width={80} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sold" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No product data yet</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
