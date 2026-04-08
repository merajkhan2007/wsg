"use client";

import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { sellerLinks } from './SellerSidebar';
import { adminLinks } from './AdminSidebar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('cart_updated', updateCartCount);

    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Dispatching a custom event on login/logout can update this immediately,
    // otherwise it will update on page refresh or when login page redirects.
    window.addEventListener('user_updated', checkUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart_updated', updateCartCount);
      window.removeEventListener('user_updated', checkUser);
    };
  }, []);

  // Handle Search Fetching
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
             setSearchResults(data.slice(0, 5) as never[]); 
             setShowDropdown(true);
          }
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle Click Outside Search
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const clickedDesktop = searchRef.current && searchRef.current.contains(event.target);
      const clickedMobile = mobileSearchRef.current && mobileSearchRef.current.contains(event.target);
      if (!clickedDesktop && !clickedMobile) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full z-50 transition-all duration-300 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] sticky top-0">
        
        {/* Top Header - Light */}
        <div className="bg-white h-[70px] flex items-center shadow-sm relative z-20 border-b border-gray-100">
          <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center">
            
            {/* LEFT: Logo & Brand */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1 text-gray-700 hover:text-brand-primary transition-colors"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-[50px] sm:h-[65px] flex items-center justify-center drop-shadow-sm">
                  <img src="/logo.png" alt="WeSoulGifts" className="w-auto h-full object-contain group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
              </Link>
            </div>

            {/* CENTER: Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-[500px] mx-8 relative" ref={searchRef}>
               <form 
                 onSubmit={(e) => { e.preventDefault(); setShowDropdown(false); router.push(`/shop?q=${searchQuery}`); }}
                 className="w-full relative"
               >
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                   placeholder="Search for gifts, handmade items..." 
                   className="w-full bg-white border border-[#ddd] rounded-[30px] py-[10px] pl-[20px] pr-[50px] text-sm text-gray-700 focus:outline-none focus:border-brand-primary transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                 />
                 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors p-1">
                   {isSearching ? <span className="animate-spin w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full block"></span> : <Search size={20} />}
                 </button>
               </form>
               
               {/* Search Dropdown */}
               {showDropdown && (
                 <div className="absolute top-[50px] left-0 w-full bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchResults.length > 0 ? (
                      <div>
                        {searchResults.map((product: any) => {
                           let displayImage = product.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=100';
                           if (product.images) {
                             try {
                               const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                               if (imgs.length > 0) displayImage = imgs[0];
                             } catch(e){}
                           }
                           return (
                             <Link 
                               key={product.id} 
                               href={`/product/${product.id}`} 
                               className="flex items-center gap-3 p-3 hover:bg-surface-light border-b border-gray-50 transition-colors" 
                               onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                             >
                               <img src={displayImage} alt="Product" className="w-10 h-10 object-cover rounded-md shadow-sm" />
                               <div className="flex-1 overflow-hidden">
                                 <h4 className="text-xs font-semibold text-gray-900 truncate">{product.title}</h4>
                                 <span className="text-brand-primary font-bold text-[11px] mt-0.5 block">₹{product.price}</span>
                               </div>
                             </Link>
                           );
                        })}
                        <Link 
                          href={`/shop?q=${searchQuery}`}
                          className="block p-3 text-center text-xs font-bold text-white bg-brand-primary hover:bg-[#d63b63] transition-colors"
                          onClick={() => { setShowDropdown(false); }}
                        >
                          View all results 
                        </Link>
                      </div>
                    ) : (
                      <div className="p-5 text-center text-sm text-gray-500 font-medium">No gifts found for "{searchQuery}"</div>
                    )}
                 </div>
               )}
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-6">
              
              {user ? (
                <Link 
                  href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'seller' ? '/seller/dashboard' : '/dashboard/customer'} 
                  className="flex items-center gap-2 group text-gray-700 hover:text-brand-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold group-hover:bg-brand-primary/20 transition-colors">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} className="stroke-[2]" />}
                  </div>
                  <span className="hidden md:block text-[14px] font-medium">{user.name || 'Dashboard'}</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-brand-primary transition-colors group">
                  <User size={22} className="stroke-[1.5]" />
                  <span className="hidden md:block text-[14px] font-medium">Login / Register</span>
                </Link>
              )}

              <Link href="/cart" className="flex items-center text-gray-700 hover:text-brand-primary transition-colors relative group">
                <ShoppingCart size={22} className="stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            
          </div>
        </div>

        {/* Bottom Menu - Gradient */}
        <div className="hidden lg:flex bg-premium-gradient h-[50px] items-center relative z-10 shadow-sm w-full px-4 xl:px-10">
          <div className="flex-1 flex items-center justify-center font-montserrat font-bold text-[12px] xl:text-[14px] leading-snug">
            <div className="flex items-center gap-4 xl:gap-8 text-white whitespace-nowrap">
              <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
              <Link href="/shop?category=handicrafts" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                HandiCrafts <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=home%20decor" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Home Decors <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=festival%20%26%20festive" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Festivals <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=art%20%26%20paintings" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Art and Painting <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=jewellery%20%26%20accessories" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Jewellery <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=love%20%26%20romance" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Love & Romance <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=personalized%20gifts" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Personalise <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
              <Link href="/shop?category=birthday" className="hover:text-white/80 transition-colors flex items-center gap-1 group">
                Birthday Gift <span className="text-[8px] opacity-60 group-hover:text-white/80 transition-colors mt-0.5">▼</span>
              </Link>
            </div>
          </div>
          
          <div className="shrink-0 pl-4 border-l border-white/20 ml-4 hidden 2xl:block">
            <Link href="/login?tab=register&role=seller" className="bg-white text-brand-primary px-5 py-1.5 rounded-full text-[11px] font-bold shadow-sm hover:bg-brand-base transition-colors flex items-center whitespace-nowrap">
              Sell on WeSoulGifts
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Input for Mobile - placed below header */}
      <div className="lg:hidden bg-white px-4 pb-3 pt-3 shadow-sm sticky top-[70px] z-40 border-t border-gray-100">
         <div className="relative max-w-full" ref={mobileSearchRef}>
           <form 
             onSubmit={(e) => { e.preventDefault(); setShowDropdown(false); router.push(`/shop?q=${searchQuery}`); }}
             className="w-full relative"
           >
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
               placeholder="Search for gifts, handmade items..." 
               className="w-full bg-white border border-[#ddd] rounded-[30px] py-[10px] pl-[20px] pr-[50px] text-sm text-gray-700 focus:outline-none focus:border-brand-primary transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
             />
             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors p-1">
               {isSearching ? <span className="animate-spin w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full block"></span> : <Search size={20} />}
             </button>
           </form>

           {/* Search Dropdown for Mobile */}
           {showDropdown && (
             <div className="absolute top-[50px] left-0 w-full bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((product: any) => {
                       let displayImage = product.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=100';
                       if (product.images) {
                         try {
                           const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                           if (imgs.length > 0) displayImage = imgs[0];
                         } catch(e){}
                       }
                       return (
                         <Link 
                           key={product.id} 
                           href={`/product/${product.id}`} 
                           className="flex items-center gap-3 p-3 hover:bg-surface-light border-b border-gray-50 transition-colors" 
                           onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                         >
                           <img src={displayImage} alt="Product" className="w-10 h-10 object-cover rounded-md shadow-sm" />
                           <div className="flex-1 overflow-hidden">
                             <h4 className="text-xs font-semibold text-gray-900 truncate">{product.title}</h4>
                             <span className="text-brand-primary font-bold text-[11px] mt-0.5 block">₹{product.price}</span>
                           </div>
                         </Link>
                       );
                    })}
                    <Link 
                      href={`/shop?q=${searchQuery}`}
                      className="block p-3 text-center text-xs font-bold text-white bg-brand-primary hover:bg-[#d63b63] transition-colors"
                      onClick={() => { setShowDropdown(false); }}
                    >
                      View all results 
                    </Link>
                  </div>
                ) : (
                  <div className="p-5 text-center text-sm text-gray-500 font-medium">No gifts found for "{searchQuery}"</div>
                )}
             </div>
           )}
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white text-gray-900 flex flex-col animate-in fade-in slide-in-from-left-8 duration-300">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shadow-sm">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">WeSoulGifts</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
            {pathname.startsWith('/seller') ? (
              <div className="flex flex-col space-y-5 text-xl font-semibold">
                <div className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Seller Menu</div>
                {sellerLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-gray-700 hover:text-brand-accent transition-colors">
                      <Icon className="mr-3 h-5 w-5 stroke-[2]" /> {link.name}
                    </Link>
                  )
                })}
              </div>
            ) : pathname.startsWith('/admin') ? (
              <div className="flex flex-col space-y-5 text-xl font-semibold">
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Admin Menu</div>
                {adminLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                      <Icon className="mr-3 h-5 w-5 stroke-[2]" /> {link.name}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col space-y-5 text-xl font-semibold">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Storefront</div>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Shop All</Link>
                <Link href="/shop?category=handicrafts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">HandiCrafts</Link>
                <Link href="/shop?category=home%20decor" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Home Decors</Link>
                <Link href="/shop?category=festival%20%26%20festive" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Festivals</Link>
                <Link href="/shop?category=art%20%26%20paintings" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Art and Painting</Link>
                <Link href="/shop?category=jewellery%20%26%20accessories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Jewellery</Link>
                <Link href="/shop?category=love%20%26%20romance" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Love & Romance</Link>
                <Link href="/shop?category=personalized%20gifts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Personalise</Link>
                <Link href="/shop?category=birthday" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-primary hover:translate-x-1 transition-all">Birthday Gift</Link>
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-6 flex flex-col space-y-5 font-medium">
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-gray-600 hover:text-brand-accent transition-colors">
                <Heart size={20} className="mr-3 stroke-[2]" /> My Wishlist
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-gray-600 hover:text-brand-accent transition-colors">
                <ShoppingCart size={20} className="mr-3 stroke-[2]" /> Shopping Cart ({cartCount})
              </Link>
            </div>
            
            {user ? (
               <div className="border-t border-gray-100 pt-6">
                 <Link 
                   href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'seller' ? '/seller/dashboard' : '/dashboard/customer'} 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center w-full justify-center py-3 bg-brand-accent/10 text-brand-accent rounded-xl font-bold"
                 >
                   Open Dashboard
                 </Link>
                 <button 
                   onClick={() => {
                     localStorage.removeItem('token');
                     localStorage.removeItem('user');
                     window.dispatchEvent(new Event('user_updated'));
                     window.location.href = '/login';
                   }}
                   className="mt-3 flex items-center w-full justify-center py-3 bg-rose-50 text-rose-500 rounded-xl font-bold transition-colors hover:bg-rose-100"
                 >
                   Logout Securely
                 </button>
               </div>
            ) : (
               <div className="border-t border-gray-100 pt-6 text-center">
                 <Link href="/login?tab=register&role=seller" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full py-3.5 bg-premium-gradient text-white rounded-xl font-bold mb-4 shadow-glow hover:opacity-90 transition-opacity">
                   Sell on WeSoulGifts
                 </Link>
                 <p className="text-sm text-gray-500 mb-3">Join us to manage orders & track gifts</p>
                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-brand-dark space-x-2 text-white rounded-xl font-bold mb-3 shadow-md hover:bg-black transition-colors">
                   Login / Register
                 </Link>
               </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
