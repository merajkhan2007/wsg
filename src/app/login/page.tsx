"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and redirect based on role
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Notify components like Navbar that user is updated
      window.dispatchEvent(new Event('user_updated'));
      
      if (data.user.role === 'admin') router.push('/admin/dashboard');
      else if (data.user.role === 'seller') router.push('/seller/dashboard');
      else router.push('/dashboard/customer');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light px-4 py-20">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-soft border border-gray-100">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-brand-pink mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue your gifting journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all" 
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link href="#" className="text-sm text-brand-pink hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                name="password"
                type="password" 
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold hover:bg-brand-darkPink transition-colors shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account? <Link href="/register" className="text-brand-pink font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
