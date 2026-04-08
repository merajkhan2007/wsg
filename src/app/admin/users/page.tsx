"use client";

import { useEffect, useState } from 'react';
import { Users, Search, ShieldAlert, Monitor, Store } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING' }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, selectElem: any) => {
    const newRole = selectElem.value;
    try {
      await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers(); // Refresh silently
    } catch(err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE_FOR_TESTING',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      setUsers(users.map((u: any) => u.id === userId ? { ...u, status: newStatus } : u));
    } catch(err) {
      console.error(err);
    }
  };

  const getRoleIcon = (role: string) => {
     if (role === 'admin') return <ShieldAlert className="w-4 h-4 text-rose-500 mr-2" />;
     if (role === 'seller') return <Store className="w-4 h-4 text-brand-primary mr-2" />;
     return <Monitor className="w-4 h-4 text-emerald-500 mr-2" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">View and manage all platform accounts and permissions.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none shadow-sm w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
             <Users className="w-5 h-5 mr-3 text-brand-accent" /> Platform Directory
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{users.length} Total</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Access</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Status</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200/50">
              {loading ? (
                 <tr><td colSpan={4} className="py-12"><div className="flex justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-brand-accent animate-spin"></div></div></td></tr>
              ) : users.length > 0 ? (
                users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 border border-white text-[#d6517a] rounded-full flex items-center justify-center font-bold shadow-sm">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                           <select 
                             value={u.role || 'customer'}
                             onChange={(e) => handleRoleChange(u.id, e.target)}
                             className={twMerge(
                               "text-xs font-semibold rounded-lg border-gray-200 py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-brand-accent outline-none appearance-none cursor-pointer",
                               u.role === 'admin' ? "bg-rose-50 text-rose-700" :
                               u.role === 'seller' ? "bg-brand-primary/10 text-[#d6517a]" : "bg-emerald-50 text-emerald-700"
                             )}
                           >
                              <option value="admin">Administrator</option>
                              <option value="seller">Seller</option>
                              <option value="customer">Customer</option>
                           </select>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <button
                         onClick={() => handleStatusChange(u.id, u.status)}
                         className={twMerge(
                           "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                           u.status === 'active' ? "bg-emerald-500" : "bg-red-500"
                         )}
                       >
                         <span className={clsx("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", u.status === 'active' ? "translate-x-5" : "translate-x-0")}></span>
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr><td colSpan={4} className="py-12 text-center text-gray-500">No users found in database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
