"use client";

import { useEffect, useState } from 'react';
import { Package, PackageSearch, UploadCloud, Download, Plus, Settings2, Check, Gift, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetch('/api/seller/inventory', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
         if (json.success) setProducts(json.products || []);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleGiftCustomization = async (id: number, current: boolean) => {
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/seller/inventory?id=${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ gift_customization: !current })
    });
    if (res.ok) {
        setProducts(products.map((p: any) => p.id === id ? { ...p, gift_customization: !current } : p));
    }
  };

  const handleExport = () => {
    if (!products || products.length === 0) return alert('No products to export');
    
    const headers = ['ID', 'Title', 'Price', 'Stock', 'Gift Customization', 'Listed Date'];
    const rows = products.map((p: any) => {
      const title = p.title ? p.title.replace(/"/g, '""') : '';
      const date = new Date(p.created_at).toLocaleDateString();
      return `${p.id},"${title}",${p.price},${p.stock},${p.gift_customization ? 'Yes' : 'No'},"${date}"`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seller_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkCSV = () => {
    alert("Bulk CSV upload functionality is currently under development. Please add products manually using the Add Product button.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory & Products</h1>
          <p className="text-gray-500 mt-2">Manage your catalog, stock levels, and gift options.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-medium transition-colors border border-gray-200 flex items-center">
             <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button onClick={handleBulkCSV} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-medium transition-colors border border-gray-200 flex items-center">
             <UploadCloud className="w-4 h-4 mr-2 text-brand-accent" /> Bulk CSV
          </button>
          <Link href="/seller/products/new" className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-glow flex items-center">
             <Plus className="w-4 h-4 mr-1" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"></div>
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PackageSearch className="w-5 h-5 mr-3 text-brand-accent" /> Catalog
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filter by:</span>
            <select className="bg-gray-50 border-none text-sm rounded-lg focus:ring-1 focus:ring-brand-accent px-3 py-1.5 outline-none">
               <option>All Items</option>
               <option>Low Stock</option>
               <option>Gift Enabled</option>
            </select>
          </div>
        </div>
        
        {loading ? (
             <div className="p-20 flex justify-center"><div className="w-8 h-8 rounded-full border-b-4 border-l-4 border-brand-accent animate-spin"></div></div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/40">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (USD)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Gift Customize</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {products.map((product: any) => {
                  let parsedImages: string[] = [];
                  if (typeof product.images === 'string') {
                    try { parsedImages = JSON.parse(product.images); } catch(e){}
                  } else if (Array.isArray(product.images)) {
                    parsedImages = product.images;
                  }
                  const displayImage = parsedImages.length > 0 ? parsedImages[0] : null;

                  return (
                  <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shadow-inner overflow-hidden">
                          {displayImage ? (
                             <img src={displayImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                             <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-800">{product.title}</div>
                          <div className="text-xs text-gray-400">Listed {new Date(product.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-700">₹{Number(product.price).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={twMerge(
                        "px-2.5 py-1 inline-flex text-xs font-medium rounded-full border",
                        product.stock > 10 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        product.stock > 0 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => toggleGiftCustomization(product.id, product.gift_customization)}
                          className={clsx(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white",
                            product.gift_customization ? "bg-brand-accent shadow-glow" : "bg-gray-200"
                          )}
                          role="switch"
                          aria-checked={product.gift_customization}
                        >
                          <span className={clsx(
                            "pointer-events-none sticky inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center",
                            product.gift_customization ? "translate-x-5" : "translate-x-0"
                          )}>
                             {product.gift_customization ? <Gift className="w-3 h-3 text-brand-accent absolute" /> : null}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                           <Link href={`/seller/products/${product.id}`} className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50 inline-block">
                              <Settings2 className="w-4 h-4"/>
                           </Link>
                           <button 
                              onClick={() => {
                                 if (window.confirm("Are you sure you want to delete this product?")) {
                                    const token = localStorage.getItem('token') || '';
                                    fetch(`/api/products?id=${product.id}`, {
                                       method: 'DELETE',
                                       headers: { 'Authorization': `Bearer ${token}` }
                                    }).then(res => {
                                       if(res.ok) setProducts(products.filter((p: any) => p.id !== product.id));
                                       else alert('Failed to delete product.');
                                    });
                                 }
                              }}
                              className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 inline-block"
                           >
                              <Trash2 className="w-4 h-4"/>
                           </button>
                        </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <PackageSearch className="w-12 h-12 text-brand-accent/20 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-700">No products yet</h4>
            <p className="text-gray-400 mt-2 mb-6">Start by uploading your first product or bulk import via CSV.</p>
            <Link href="/seller/products/new" className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl text-sm font-semibold transition-colors shadow-glow inline-block">
              Create Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
// Trigger rebuild
