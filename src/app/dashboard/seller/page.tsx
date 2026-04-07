"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, TrendingUp, Store, LogOut, PlusCircle, Pencil, Trash2, X, UploadCloud, AlertCircle } from 'lucide-react';

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  
  // Dashboard Data
  const [sellerData, setSellerData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>({ revenue: 0, active_products: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form States
  const [formData, setFormData] = useState({ title: '', price: '', stock: '', category_id: '', description: '', images: [] as string[] });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [imageUploadSuccess, setImageUploadSuccess] = useState('');
  const [shopNameForm, setShopNameForm] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    
    if (!userData || !userToken) {
      router.push('/login');
    } else {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'seller') {
        router.push('/');
      } else {
        setUser(parsed);
        setToken(userToken);
        fetchDashboardData(parsed.id, userToken);
        fetchCategories();
      }
    }
  }, [router]);

  const fetchDashboardData = async (userId: number, authToken: string) => {
    try {
      setLoading(true);
      // Fetch Seller Analytics & Profile
      const sellerRes = await fetch('/api/seller', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (sellerRes.ok) {
        const data = await sellerRes.json();
        setSellerData(data.seller);
        setAnalytics(data.analytics);
        setShopNameForm(data.seller.shop_name);
      }

      // Fetch Products
      const productsRes = await fetch(`/api/products?seller_user_id=${userId}`);
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch(err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user_updated'));
    router.push('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    setFormError('');
    setImageUploadSuccess('');
    try {
      const data = new FormData();
      data.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setFormData(prev => ({ ...prev, images: [result.url] }));
      setImageUploadSuccess('Image uploaded successfully!');
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed. Ensure Cloud credentials are set.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingProduct?.id };
      
      const res = await fetch('/api/products', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setIsModalOpen(false);
      fetchDashboardData(user.id, token);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardData(user.id, token);
      }
    } catch (err) {
       console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormError('');
    setImageUploadSuccess('');
    setFormData({ title: '', price: '', stock: '', category_id: categories.length > 0 ? categories[0].id : '', description: '', images: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormError('');
    setImageUploadSuccess('');
    setFormData({ 
      title: product.title, 
      price: product.price, 
      stock: product.stock, 
      category_id: product.category_id, 
      description: product.description || '', 
      images: product.images || [] 
    });
    setIsModalOpen(true);
  };
  
  const handleUpdateStore = async (e: React.FormEvent) => {
     e.preventDefault();
     setSettingsMessage('');
     try {
       const res = await fetch('/api/seller', {
          method: 'PUT',
          headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ shop_name: shopNameForm })
       });
       if (!res.ok) throw new Error('Failed to update store');
       setSettingsMessage('Store updated successfully!');
       fetchDashboardData(user.id, token);
     } catch(err: any) {
       setSettingsMessage(err.message);
     }
  };

  if (!user || loading) return <div className="min-h-screen bg-surface-light flex items-center justify-center">Loading...</div>;

  const tabClass = (tab: string) => `flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-left ${activeTab === tab ? 'bg-brand-pink/10 text-brand-pink font-medium' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-500">Manage your store - <span className="font-semibold text-brand-pink">{sellerData?.shop_name}</span></p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>

        {sellerData?.approval_status === 'pending' && (
           <div className="mb-6 bg-yellow-50 text-yellow-700 p-4 rounded-xl flex items-center gap-3 border border-yellow-200">
              <AlertCircle size={20} />
              <p>Your seller account is currently pending approval. Customers won't see your products until an admin approves your store.</p>
           </div>
        )}
        {sellerData?.approval_status === 'rejected' && (
           <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
              <AlertCircle size={20} />
              <p>Your seller account was rejected. Please contact support.</p>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 border border-gray-100 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 h-fit">
             <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>
                <LayoutDashboard size={20} /> Overview
             </button>
             <button onClick={() => setActiveTab('products')} className={tabClass('products')}>
                <Package size={20} /> Manage Products
             </button>
             <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>
                <Store size={20} /> Store Settings
             </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-2">
                     <div className="flex justify-between items-start mb-4">
                        <p className="text-gray-500 font-medium">Total Revenue</p>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                     </div>
                     <h3 className="text-3xl font-bold text-gray-900">₹{analytics.revenue.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-2">
                     <div className="flex justify-between items-start mb-4">
                        <p className="text-gray-500 font-medium">Active Products</p>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20} /></div>
                     </div>
                     <h3 className="text-3xl font-bold text-gray-900">{analytics.active_products}</h3>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                   <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Recent Activity</h2>
                   <p className="text-gray-500 text-sm">You have {products.length} products listed. Check back here for order updates when customers purchase your items!</p>
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-bold text-gray-900">Your Products ({products.length})</h2>
                  <button onClick={openAddModal} className="bg-brand-teal text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-brand-burgundy transition-colors">
                    <PlusCircle size={18} /> Add Product
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 text-sm">
                        <th className="pb-4 font-medium">Product</th>
                        <th className="pb-4 font-medium">Category</th>
                        <th className="pb-4 font-medium">Price</th>
                        <th className="pb-4 font-medium">Stock</th>
                        <th className="pb-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.length === 0 ? (
                         <tr><td colSpan={5} className="py-8 text-center text-gray-500">You haven't added any products yet.</td></tr>
                      ) : products.map(product => {
                        const displayImage = product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop';
                        return (
                        <tr key={product.id}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                 <img src={displayImage} className="w-full h-full object-cover" alt={product.title} />
                              </div>
                              <span className="font-medium text-gray-900">{product.title}</span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600">{product.category_name}</td>
                          <td className="py-4 font-medium text-gray-900">₹{product.price}</td>
                          <td className="py-4 text-green-600">In Stock ({product.stock})</td>
                          <td className="py-4 text-sm font-medium text-right">
                            <button onClick={() => openEditModal(product)} className="text-brand-teal hover:underline mr-4 p-2 bg-brand-teal/10 rounded-lg inline-flex"><Pencil size={16} /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:underline p-2 bg-red-50 rounded-lg inline-flex"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Store Settings</h2>
                {settingsMessage && <p className={`mb-4 p-3 rounded-lg text-sm ${settingsMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{settingsMessage}</p>}
                
                <form onSubmit={handleUpdateStore} className="max-w-md space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                      <input 
                         type="text" 
                         value={shopNameForm}
                         onChange={(e) => setShopNameForm(e.target.value)}
                         className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-pink"
                         required
                      />
                   </div>
                   <button type="submit" className="bg-brand-pink text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-darkPink transition-colors">
                      Save Changes
                   </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h2 className="text-2xl font-serif font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full cursor-pointer">
                    <X size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
                 {formError && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{formError}</div>}
                 {imageUploadSuccess && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm">{imageUploadSuccess}</div>}
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium text-gray-700">Product Title</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink" 
                      />
                   </div>
                   <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select 
                        required 
                        value={formData.category_id}
                        onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink"
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                      <input 
                        required 
                        type="number" 
                        min="0" step="0.01"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                      <input 
                        required 
                        type="number" 
                        min="0"
                        value={formData.stock}
                        onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink" 
                      />
                   </div>
                   <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea 
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-pink" 
                      ></textarea>
                   </div>
                   <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-gray-700">Product Image (Cloudinary Upload)</label>
                      
                      {formData.images.length > 0 ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden group">
                           <img src={formData.images[0]} alt="Upload preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setFormData(prev => ({...prev, images: []}))} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div className="text-center">
                            <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">{uploadingImage ? 'Uploading to cloud...' : 'Click to Upload Image'}</p>
                          </div>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                   </div>
                 </div>
                 
                 <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={uploadingImage} className="px-8 py-3 bg-brand-pink text-white font-bold rounded-xl hover:bg-brand-darkPink transition-colors shadow-glow disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed">
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
