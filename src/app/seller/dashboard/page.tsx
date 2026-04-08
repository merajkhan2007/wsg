"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  Package, 
  ShoppingCart, 
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function SellerDashboard() {
  const [data, setData] = useState<{
    stats: { total_products: number; total_orders: number; total_revenue: number };
    growth: { revenue: number; orders: number; products: number };
    revenueOverTime: any[];
    topProducts: any[];
  }>({
    stats: { total_products: 0, total_orders: 0, total_revenue: 0 },
    growth: { revenue: 0, orders: 0, products: 0 },
    revenueOverTime: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/seller/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
         if (json.success) setData(json);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-10 h-10 rounded-full border-b-4 border-brand-accent border-l-4 animate-spin"></div></div>;

  const statCards = [
    { title: 'Gross Revenue', value: `₹${Number(data.stats.total_revenue).toFixed(2)}`, icon: IndianRupee, color: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20', growth: data.growth.revenue },
    { title: 'Total Orders', value: data.stats.total_orders, icon: ShoppingCart, color: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20', growth: data.growth.orders },
    { title: 'Active Products', value: data.stats.total_products, icon: Package, color: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20', growth: data.growth.products },
    { title: 'Store Conversion', value: '4.2%', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            Store Performance <Sparkles className="w-6 h-6 ml-2 text-brand-accent"/>
          </h1>
          <p className="text-gray-500 mt-2">Scale your business with real-time insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-6 overflow-hidden hover:border-gray-200 transition-all shadow-soft">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className={`p-3 rounded-2xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.growth !== undefined && (
                  <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full border ${stat.growth >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border-rose-500/20'}`}>
                    {stat.growth > 0 ? '+' : ''}{stat.growth}% 
                    {stat.growth >= 0 ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                  </span>
                )}
              </div>
              <div className="mt-5 relative z-10">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:scale-[1.02] transform transition-transform origin-left">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 relative overflow-hidden shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Growth</h3>
          <div className="h-80 w-full relative z-10">
            {data.revenueOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueOverTime} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea658d" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ea658d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#ea658d' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ea658d" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400">No sales data recorded yet</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Trending Items</h3>
          <div className="h-80 w-full">
            {data.topProducts.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis type="category" dataKey="title" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} width={80} />
                  <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sold" fill="#1fa39c" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Add products to see trends</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
