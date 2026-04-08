"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart, Settings, LogOut, MessageSquare, Send, Clock, User as UserIcon, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'wishlist' | 'settings'>('orders');
  
  // Chat state
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(false);
  const [token, setToken] = useState('');

  // Wishlist state
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Settings state
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const rawData = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token') || '';
    setToken(storedToken);
    
    if (!rawData) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(rawData);
      setUser(parsedUser);
      // Fetch Orders
      fetch(`/api/orders?user_id=${parsedUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
          else console.error(data.error);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
        
      setProfile({ name: parsedUser.name || '', email: parsedUser.email || '' });
    }
  }, [router]);

  // Fetch Conversations when tab changes to messages
  useEffect(() => {
    if (activeTab === 'messages' && token) {
      setLoadingConvos(true);
      fetch('/api/customer/chat', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) setConversations(json.conversations || []);
      })
      .finally(() => setLoadingConvos(false));
    }
  }, [activeTab, token]);

  // Fetch Wishlist
  useEffect(() => {
    if (activeTab === 'wishlist') {
      setLoadingWishlist(true);
      if (token) {
        fetch('/api/customer/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setWishlist(data);
        })
        .finally(() => setLoadingWishlist(false));
      } else {
        const existing = localStorage.getItem('wishlist');
        setWishlist(existing ? JSON.parse(existing) : []);
        setLoadingWishlist(false);
      }
    }
  }, [activeTab, token]);

  const removeFromWishlist = async (id: number) => {
    if (token) {
      await fetch(`/api/customer/wishlist?product_id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item.id !== id));
    } else {
      const updated = wishlist.filter(item => item.id !== id);
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
    window.dispatchEvent(new Event('wishlist_updated'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user_updated'));
    router.push('/login');
  };

  const loadConversation = async (conv: any) => {
    setActiveChat(conv);
    setChatLoading(true);
    try {
      const res = await fetch(`/api/customer/chat?orderId=${conv.order_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setMessages(json.messages || []);
    } catch(err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const startChatFromOrder = (order: any) => {
    setActiveTab('messages');
    // We can simulate an active conversation object to get started. 
    // Usually the user will send the first message to create the conv if it doesn't exist
    const mockConv = {
      order_id: order.id,
      seller_name: 'Seller for Order #' + String(order.id).padStart(4, '0'), // temporary display
    };
    loadConversation(mockConv);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgContent = newMessage;
    setNewMessage('');
    
    // Optimistic update
    const genericNewMessage = {
        id: Date.now(),
        content: msgContent,
        sender_id: user?.id,
        created_at: new Date().toISOString()
    };
    setMessages([...messages, genericNewMessage] as any);

    try {
      await fetch('/api/customer/chat', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: activeChat.order_id,
          content: msgContent
        })
      });
      // Optionally reload from server to get correct IDs
    } catch(err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMsg({ text: '', type: '' });

    if (passwords.new && passwords.new !== passwords.confirm) {
      setSettingsMsg({ text: 'New passwords do not match', type: 'error' });
      setSettingsLoading(false);
      return;
    }

    try {
      const payload: any = { name: profile.name };
      if (passwords.new) {
         payload.password = passwords.current;
         payload.newPassword = passwords.new;
      }

      const res = await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
         setSettingsMsg({ text: 'Profile updated successfully!', type: 'success' });
         setPasswords({ current: '', new: '', confirm: '' });
         const updatedUser = { ...user, name: data.profile.name };
         setUser(updatedUser);
         localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
         setSettingsMsg({ text: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch(err) {
      setSettingsMsg({ text: 'An unexpected error occurred', type: 'error' });
    } finally {
      setSettingsLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-surface-light flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-500">Welcome back, {user.name}!</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 border border-gray-100 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 h-fit">
             <button 
               onClick={() => setActiveTab('orders')}
               className={twMerge("flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors text-left", 
                 activeTab === 'orders' ? "bg-brand-primary/10 text-brand-primary" : "text-gray-600 hover:bg-gray-50")}
             >
                <Package size={20} /> My Orders
             </button>
             <button 
               onClick={() => setActiveTab('messages')}
               className={twMerge("flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors text-left", 
                 activeTab === 'messages' ? "bg-brand-accent/10 text-brand-accent" : "text-gray-600 hover:bg-gray-50")}
             >
                <MessageSquare size={20} /> Messages
             </button>
             <button 
               onClick={() => setActiveTab('wishlist')}
               className={twMerge("flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors text-left", 
                 activeTab === 'wishlist' ? "bg-brand-primary/10 text-brand-primary" : "text-gray-600 hover:bg-gray-50")}
             >
                <Heart size={20} /> Wishlist
             </button>
             <button 
               onClick={() => setActiveTab('settings')}
               className={twMerge("flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-colors text-left", 
                 activeTab === 'settings' ? "bg-brand-primary/10 text-brand-primary" : "text-gray-600 hover:bg-gray-50")}
             >
                <Settings size={20} /> Profile Settings
             </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            
            {activeTab === 'orders' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Recent Orders</h2>
                
                {/* Real Orders */}
                <div className="space-y-6">
                  {loadingOrders ? (
                    <p className="text-gray-500">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                      You haven't placed any orders yet.
                    </div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-6 flex flex-col justify-between gap-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">#WSG-{String(order.id).padStart(4, '0')}</span>
                            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full uppercase tracking-wider">{order.status}</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium line-clamp-1 mb-1">{order.product_names || 'Products'}</p>
                          <p className="text-xs text-gray-500 mb-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="font-semibold text-gray-900">Total: ₹{Number(order.total_amount).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <button 
                            onClick={() => startChatFromOrder(order)}
                            className="text-center bg-orange-100 text-orange-700 px-6 py-2 rounded-full font-medium hover:bg-orange-200 transition-colors flex items-center justify-center gap-2 border border-orange-200"
                          >
                            <MessageSquare size={16} /> Need Support
                          </button>
                          <Link href={`/dashboard/customer/order/${order.id}`} className="text-center bg-gray-50 text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex h-[600px] animate-in fade-in duration-300">
                
                {/* Sidebar Conversations List */}
                <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
                  <div className="p-4 border-b border-gray-100 bg-white">
                    <h3 className="font-semibold text-gray-800">Your Conversations</h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {loadingConvos ? (
                       <div className="p-6 flex justify-center"><div className="w-6 h-6 rounded-full border-b-2 border-l-2 border-brand-accent animate-spin"></div></div>
                    ) : conversations.length > 0 ? (
                       conversations.map((conv: any, i) => (
                         <button 
                          key={i} 
                          onClick={() => loadConversation(conv)}
                          className={twMerge(
                            "w-full text-left p-4 flex items-start gap-4 hover:bg-white transition-colors border-b border-gray-100",
                            activeChat?.order_id === conv.order_id && "bg-white border-l-2 border-l-brand-accent shadow-sm"
                          )}
                         >
                            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0 text-brand-accent">
                               <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-baseline mb-1">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.seller_name || 'Seller'}</p>
                                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                     {conv.status === 'resolved' && <span className="text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-bold uppercase tracking-wider">Resolved</span>}
                                     <span className="text-xs text-gray-400">
                                        {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                     </span>
                                  </div>
                               </div>
                               <p className="text-xs text-gray-500 truncate mb-1.5">{conv.content}</p>
                               <div className="flex items-center text-[10px] text-brand-accent font-medium">
                                  <Package className="w-3 h-3 mr-1" /> Order #{String(conv.order_id).padStart(4, '0')}
                               </div>
                            </div>
                         </button>
                       ))
                    ) : (
                       <div className="p-10 text-center text-gray-400 text-sm">No active conversations. Start a chat from your orders.</div>
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                  {activeChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center text-gray-800 bg-white shadow-sm z-10">
                        <div className="flex items-center gap-3">
                       <h3 className="font-semibold flex items-center gap-2">
                          Order #{String(activeChat.order_id).padStart(4, '0')} Support (Admin Mediated)
                          {activeChat.status === 'resolved' && (
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-200">Resolved</span>
                          )}
                       </h3>
                          <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full font-medium">
                            Privacy Protected
                          </span>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-slate-50">
                        {chatLoading ? (
                           <div className="flex-1 flex items-center justify-center text-gray-400"><div className="w-6 h-6 rounded-full border-b-2 border-l-2 border-brand-accent animate-spin"></div></div>
                        ) : messages.length > 0 ? (
                           messages.map((msg: any, idx) => {
                             const isMe = msg.sender_id === user.id;
                             return (
                               <div key={idx} className={twMerge("flex w-full", isMe ? "justify-end" : "justify-start")}>
                                  <div className={twMerge(
                                    "max-w-[75%] rounded-2xl p-4 shadow-sm text-sm",
                                    isMe 
                                     ? "bg-brand-primary text-white rounded-tr-sm" 
                                     : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
                                  )}>
                                     <p>{msg.content}</p>
                                     <div className={twMerge("flex items-center text-[10px] mt-2 opacity-80", isMe ? "justify-end text-white/80" : "justify-start text-gray-500")}>
                                       {msg.status === 'resolved' && (
                                          <span className="mr-2 font-bold tracking-wide">✓ RESOLVED</span>
                                       )}
                                       <Clock className="w-3 h-3 mr-1" />
                                       {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </div>
                                  </div>
                               </div>
                             )
                           })
                        ) : (
                             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                               <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                               Messages routed through admin support for privacy.
                             </div>
                        )}
                      </div>

                      {/* Input Area */}
                      <div className="p-4 bg-white border-t border-gray-100">
                        {activeChat.status === 'resolved' ? (
                           <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center text-green-700 text-sm font-medium">
                              This conversation has been marked as resolved.
                           </div>
                        ) : (
                          <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input 
                              type="text" 
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..." 
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all placeholder:text-gray-400"
                            />
                            <button 
                              type="submit" 
                              disabled={!newMessage.trim()}
                              className="bg-brand-primary hover:bg-[#d63b63] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-colors shadow-glow flex items-center justify-center"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </form>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
                       <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                       <h3 className="text-lg font-medium text-gray-700">Select a Conversation</h3>
                       <p className="text-sm mt-2 max-w-sm text-center">Choose a chat from the sidebar or start a new one from your orders list.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] animate-in fade-in duration-300">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                   <Heart className="w-6 h-6 text-brand-primary fill-current" />
                   My Wishlist
                </h2>

                {loadingWishlist ? (
                   <p className="text-gray-500">Loading wishlist...</p>
                ) : wishlist.length === 0 ? (
                   <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                      <Heart size={40} className="mb-4 text-gray-200" />
                      <h3 className="text-lg font-medium text-gray-600">Wishlist Empty</h3>
                      <p>You haven't added any items to your wishlist yet.</p>
                      <Link href="/shop" className="mt-6 text-brand-accent hover:text-brand-dark font-medium transition-colors">
                         Explore Shop
                      </Link>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map(product => (
                         <div key={product.id} className="relative bg-surface-light rounded-xl border border-gray-100 overflow-hidden group hover:shadow-soft transition-all duration-300">
                            <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
                               <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </Link>
                            <button 
                               onClick={() => removeFromWishlist(product.id)}
                               className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                            >
                               <Trash2 size={16} />
                            </button>
                            <div className="p-4">
                               <div className="text-xs font-semibold text-brand-accent uppercase tracking-wider mb-1">{product.category_name || 'Gift'}</div>
                               <Link href={`/product/${product.id}`} className="font-serif font-bold text-gray-900 line-clamp-1 hover:text-brand-primary transition-colors">
                                  {product.title || product.name}
                               </Link>
                               <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                  <span className="font-bold text-brand-primary">₹{product.price}</span>
                                  <Link href={`/product/${product.id}`} className="text-brand-accent hover:text-brand-dark font-medium text-sm flex items-center gap-1.5 transition-colors">
                                    <ShoppingCart size={14} /> View
                                  </Link>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
              </div>
            )}
            
            {/* Profile Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
                 <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-brand-accent" />
                    Profile Settings
                 </h2>
                 
                 {settingsMsg.text && (
                   <div className={twMerge("mb-6 p-4 rounded-xl text-sm font-medium border", settingsMsg.type === 'success' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
                      {settingsMsg.text}
                   </div>
                 )}

                 <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                    <div className="space-y-4">
                       <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Personal Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                             <input 
                                type="text" 
                                value={profile.name}
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-gray-900"
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                             <input 
                                type="email" 
                                value={profile.email}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed opacity-70"
                             />
                             <p className="text-[10px] text-gray-400 mt-1 pl-1">Email cannot be changed online.</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 mt-8">
                       <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Security (Optional)</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Password</label>
                             <input 
                                type="password" 
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-gray-900"
                                placeholder="Enter to change password"
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                             <input 
                                type="password" 
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-gray-900"
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm New Password</label>
                             <input 
                                type="password" 
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-gray-900"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-start pt-6 mt-6 border-t border-gray-100">
                       <button 
                          type="submit" 
                          disabled={settingsLoading}
                          className="bg-brand-accent hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 flex items-center"
                       >
                          {settingsLoading ? (
                             <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin mr-2"></div>
                          ) : 'Save Changes'}
                       </button>
                    </div>
                 </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
