"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackagePlus, ArrowLeft, Save, IndianRupee, Image as ImageIcon, Sparkles, X, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  // Image Upload State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    special_price: '',
    stock: '',
    category_id: '',
    delivery_days: '3'
  });

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories", err));

    // Fetch product details
    fetch(`/api/products?id=${params.id}`)
      .then(res => res.json())
      .then(data => {
         if (data && data.length > 0) {
            const product = data[0];
            setFormData({
               title: product.title || '',
               description: product.description || '',
               price: product.price ? product.price.toString() : '',
               special_price: product.special_price ? product.special_price.toString() : '',
               stock: product.stock !== null ? product.stock.toString() : '',
               category_id: product.category_id ? product.category_id.toString() : '',
               delivery_days: product.delivery_days ? product.delivery_days.toString() : '3'
            });

            if (product.images && Array.isArray(product.images)) {
               setUploadedImages(product.images);
            }
         } else {
            setMsg({ text: 'Product not found', type: 'error' });
         }
         setFetching(false);
      })
      .catch(err => {
         console.error("Failed to load product", err);
         setMsg({ text: 'Failed to load product details', type: 'error' });
         setFetching(false);
      });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    setUploadError('');
    
    const files = Array.from(e.target.files);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          return data.url;
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      setUploadError(err.message || 'Network error while uploading images.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: params.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          special_price: formData.special_price ? parseFloat(formData.special_price) : null,
          stock: parseInt(formData.stock),
          category_id: parseInt(formData.category_id),
          images: uploadedImages,
          delivery_days: parseInt(formData.delivery_days) || 3
        })
      });

      const json = await res.json();
      if (res.ok) {
         setMsg({ text: 'Product updated successfully!', type: 'success' });
      } else {
         setMsg({ text: json.error || 'Failed to update product', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
       return;
    }

    setDeleting(true);
    setMsg({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products?id=${params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      if (res.ok) {
         setMsg({ text: 'Product deleted successfully!', type: 'success' });
         setTimeout(() => {
            router.push('/seller/products');
         }, 1000);
      } else {
         setMsg({ text: json.error || 'Failed to delete product', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
     return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-brand-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <Link href="/seller/products" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-brand-accent transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Inventory
           </Link>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              <PackagePlus className="w-8 h-8 text-brand-accent p-1 bg-brand-accent/10 rounded-lg border border-brand-accent/20" />
              Edit Product
           </h1>
           <p className="text-gray-500 mt-2">Update product details, pricing, and media.</p>
        </div>
        <div>
           <button 
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors border border-red-200 flex items-center shadow-sm"
           >
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete Product
           </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Form Fields */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"></div>
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Core Information</h3>
               
               {msg.text && (
                 <div className={twMerge("p-4 rounded-xl text-sm font-medium border mb-6", msg.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
                    {msg.text}
                 </div>
               )}

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Title</label>
                     <input 
                        type="text" 
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Handmade Ceramic Vase"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 font-medium"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                     <textarea 
                        name="description"
                        required
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detail the materials, dimensions, and story behind this product..."
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 resize-none leading-relaxed"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft relative overflow-hidden">
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-3 text-brand-accent" /> Product Media
               </h3>

               {uploadError && (
                 <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-xl">
                   {uploadError}
                 </div>
               )}
               
               {/* Uploaded Images Gallery */}
               {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                     {uploadedImages.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                           <img src={url} alt="Product media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                           <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                           >
                              <X className="w-3 h-3" />
                           </button>
                        </div>
                     ))}
                  </div>
               )}

               {/* Upload Dropzone */}
               <label className={twMerge(
                  "border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:bg-gray-50 p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group",
                  uploadingImage && "opacity-60 pointer-events-none"
               )}>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  
                  <div className="w-16 h-16 bg-white group-hover:bg-brand-accent/5 rounded-2xl flex items-center justify-center shadow-soft mb-4 border border-gray-100 transition-colors">
                     {uploadingImage ? (
                        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
                     ) : (
                        <UploadCloud className="w-8 h-8 text-brand-accent" />
                     )}
                  </div>
                  <h4 className="font-semibold text-gray-700">
                     {uploadingImage ? 'Uploading securely to Cloudinary...' : 'Click or Drag images to upload'}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">Maximum file size: 5MB. Supports JPG, PNG, WEBP.</p>
               </label>
            </div>
         </div>

         {/* Sidebar Configurations */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft relative overflow-hidden h-fit">
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Pricing & Stock</h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Base Price (MRP)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold"><IndianRupee className="w-4 h-4" /></span>
                        <input 
                           type="number"
                           name="price"
                           required
                           min="0"
                           step="0.01"
                           value={formData.price}
                           onChange={handleChange}
                           placeholder="0.00"
                           className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 font-mono"
                        />
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Special Price (Selling Price)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold"><IndianRupee className="w-4 h-4" /></span>
                        <input 
                           type="number"
                           name="special_price"
                           min="0"
                           step="0.01"
                           value={formData.special_price}
                           onChange={handleChange}
                           placeholder="0.00"
                           className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 font-mono"
                        />
                     </div>
                     <p className="text-[10px] text-gray-500 mt-1">Leave empty if no discount applies.</p>
                  </div>
                  
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Available Quantity</label>
                     <input 
                        type="number"
                        name="stock"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="e.g. 50"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 font-mono"
                     />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Days</label>
                     <input 
                        type="number"
                        name="delivery_days"
                        required
                        min="1"
                        value={formData.delivery_days}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 font-mono"
                     />
                     <p className="text-[10px] text-gray-500 mt-1">Expected delivery time in days.</p>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft relative overflow-hidden h-fit">
               <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Marketplace Category</h3>
               
               <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Category</label>
                  <select 
                     name="category_id"
                     required
                     value={formData.category_id}
                     onChange={handleChange}
                     className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all text-gray-900 appearance-none cursor-pointer"
                  >
                     <option value="" disabled>Choose a placement...</option>
                     {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                  </select>
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-100">
                  <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:bg-gray-50 disabled:text-gray-400 text-white rounded-xl py-3.5 font-semibold transition-colors flex items-center justify-center shadow-glow disabled:shadow-none"
                  >
                     {loading ? (
                        <div className="flex items-center">
                           <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin mr-2"></div>
                           Saving Changes...
                        </div>
                     ) : (
                        <>
                           <Save className="w-4 h-4 mr-2" /> Save Product
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
