"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('customer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'seller' || urlRole === 'customer') {
        setRole(urlRole);
      }
    }
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (role === 'seller') router.push('/dashboard/seller');
      else router.push('/dashboard/customer');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light px-4 py-20">
      <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-3xl shadow-soft border border-gray-100">
        <div className="text-center mb-8">
          <Sparkles className="w-10 h-10 text-brand-primary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Join WeSoulGifts</h1>
          <p className="text-gray-500">Create an account to unlock premium gifting</p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-8 border border-gray-200">
           <button 
             type="button" 
             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'customer' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
             onClick={() => setRole('customer')}
           >
             Customer
           </button>
           <button 
             type="button" 
             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'seller' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
             onClick={() => setRole('seller')}
           >
             Become a Seller
           </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                name="name"
                type="text" 
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" 
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                name="password"
                type="password" 
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" 
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-[#d63b63] transition-colors shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : (role === 'seller' ? 'Create Seller Account' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already have an account? <Link href="/login" className="text-brand-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
