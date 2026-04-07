"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Store, LayoutDashboard, Settings, LogOut, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    
    if (!userData || !userToken) {
      router.push('/login');
    } else {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        router.push('/');
      } else {
        setUser(parsed);
        setToken(userToken);
        fetchSellers(userToken);
      }
    }
  }, [router]);

  const fetchSellers = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sellers', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSellers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/sellers?id=${id}&action=${action}`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSellers(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user_updated'));
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen bg-surface-light flex items-center justify-center">Loading...</div>;

  const tabClass = (tab: string) => `flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-left ${activeTab === tab ? 'bg-brand-pink/10 text-brand-pink font-medium' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Control Panel</h1>
            <p className="text-gray-500">Manage platform, sellers, and users</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 border border-gray-100 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 h-fit">
             <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>
                <div className="flex items-center gap-3"><LayoutDashboard size={20} /> Overview</div>
             </button>
             <button onClick={() => setActiveTab('sellers')} className={`${tabClass('sellers')} flex justify-between`}>
                <div className="flex items-center gap-3"><Store size={20} /> Sellers</div>
                {sellers.filter(s => s.approval_status === 'pending').length > 0 && (
                  <span className="bg-brand-pink text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {sellers.filter(s => s.approval_status === 'pending').length}
                  </span>
                )}
             </button>
             <button onClick={() => setActiveTab('users')} className={tabClass('users')}>
                <div className="flex items-center gap-3"><Users size={20} /> Users</div>
             </button>
             <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>
                <div className="flex items-center gap-3"><Settings size={20} /> Platform Settings</div>
             </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                {/* Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                     <div>
                        <p className="text-gray-500 font-medium mb-1">Active Sellers</p>
                        <h3 className="text-3xl font-bold text-gray-900">{sellers.filter(s => s.approval_status === 'approved').length}</h3>
                     </div>
                     <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Store size={24} /></div>
                  </div>
                </div>

                {/* Seller Approvals */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Pending Seller Approvals</h2>
                  
                  <div className="space-y-4">
                    {loading ? (
                       <p className="text-gray-500">Loading sellers...</p>
                    ) : sellers.filter(s => s.approval_status === 'pending').length === 0 ? (
                       <p className="text-gray-500 bg-gray-50 p-6 rounded-xl text-center border border-gray-100">No pending seller approvals.</p>
                    ) : sellers.filter(s => s.approval_status === 'pending').map((seller) => (
                      <div key={seller.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-gray-100 rounded-xl gap-4 hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-serif font-bold text-xl uppercase">
                             {seller.shop_name?.charAt(0) || seller.name?.charAt(0)}
                           </div>
                           <div>
                             <h4 className="font-semibold text-gray-900">{seller.shop_name}</h4>
                             <p className="text-sm text-gray-500">Requested by {seller.name} • {new Date(seller.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleAction(seller.id, 'approve')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 font-medium text-sm">
                             <CheckCircle2 size={18} /> Approve
                           </button>
                           <button onClick={() => handleAction(seller.id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-medium text-sm">
                             <XCircle size={18} /> Reject
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sellers' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">All Sellers</h2>
                <div className="space-y-4">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-gray-100 rounded-xl gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-serif font-bold">
                          {seller.shop_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{seller.shop_name}</h4>
                          <p className="text-sm text-gray-500">{seller.name} • {seller.email}</p>
                        </div>
                      </div>
                      <div>
                        {seller.approval_status === 'approved' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>}
                        {seller.approval_status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>}
                        {seller.approval_status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>}
                      </div>
                    </div>
                  ))}
                  {sellers.length === 0 && !loading && (
                    <p className="text-gray-500">No sellers registered yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Users size={32} /></div>
                 <h2 className="text-xl font-medium text-gray-900 mb-2">User Management</h2>
                 <p className="text-gray-500">User management module is currently under development. Here you will be able to see all registered customers.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                 <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4"><Settings size={32} /></div>
                 <h2 className="text-xl font-medium text-gray-900 mb-2">Platform Settings</h2>
                 <p className="text-gray-500">Global platform configurations (tax rates, categories, SEO) will be available here soon.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
