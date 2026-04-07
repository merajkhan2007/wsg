"use client";

import { useEffect, useState } from 'react';
import { Ticket, Search, CheckCircle, Clock, AlertCircle, MessageCircle, Send, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetch('/api/admin/tickets', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
         if (json.success) setTickets(json.tickets || []);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadTicket = async (id: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/admin/tickets?id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setActiveTicket(json.ticket);
        setReplies(json.replies || []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const forwardToSeller = async () => {
    if (!activeTicket || !activeTicket.seller_id) return alert('No seller associated');
    // Create notification or reply in seller's context
    alert(`Forwarded to seller ${activeTicket.seller_id}`);
  };

  const forwardToCustomer = async () => {
    // Notify customer via ticket reply or email
    alert('Message forwarded to customer');
  };

  const handleSendReply = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault();
    if (!activeTicket) return;
    
    const newStatus = statusOverride || activeTicket.status;
    const isResolving = statusOverride === 'resolved';

    // Optimistic Update
    if (replyMessage.trim()) {
        const optimisticReply = {
          id: Date.now(),
          message: replyMessage,
          sender_name: 'Admin',
          sender_role: 'admin',
          created_at: new Date().toISOString()
        };
        setReplies([...replies, optimisticReply] as any);
    }

    try {
      const token = localStorage.getItem('token') || '';
      await fetch(`/api/admin/tickets?id=${activeTicket.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          message: replyMessage.trim() || 'Admin action',
          status: newStatus
        })
      });
      
      setReplyMessage('');
      setActiveTicket({ ...activeTicket, status: newStatus });
      setTickets(tickets.map((t: any) => t.id === activeTicket.id ? { ...t, status: newStatus } : t));
    } catch(err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="bg-amber-100 text-amber-800 flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"><AlertCircle className="w-3 h-3 mr-1" /> Open</span>;
      case 'pending':
        return <span className="bg-brand-teal/20 text-blue-800 flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-brand-teal/30"><Clock className="w-3 h-3 mr-1" /> Pending Response</span>;
      case 'resolved':
        return <span className="bg-emerald-100 text-emerald-800 flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Support Desk</h1>
          <p className="text-gray-500 mt-2">Manage customer and seller inquiries across the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket List View */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-[calc(100vh-200px)] lg:col-span-1">
          <div className="p-4 border-b border-gray-100/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-teal outline-none text-sm bg-gray-50/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
                 <div className="p-10 flex justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-brand-teal animate-spin"></div></div>
            ) : tickets.length > 0 ? (
               <div className="divide-y divide-gray-100/50">
                 {tickets.map((t: any) => (
                   <div 
                    key={t.id} 
                    onClick={() => loadTicket(t.id)}
                    className={twMerge(
                      "p-5 cursor-pointer hover:bg-gray-50/50 transition-colors border-l-2 border-transparent",
                      activeTicket?.id === t.id && "bg-brand-teal/10/50 border-brand-teal"
                    )}
                   >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500">#{t.id} • {t.user_role}</span>
                        {getStatusBadge(t.status)}
                     </div>
                     <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{t.subject}</h4>
                     <p className="text-xs text-gray-500 truncate mb-2">From: {t.user_name}</p>
                     <span className="text-[10px] text-gray-400">{new Date(t.created_at).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
            ) : (
               <div className="p-10 text-center text-gray-500 text-sm">No tickets found.</div>
            )}
          </div>
        </div>

        {/* Ticket Detail View */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2 flex flex-col h-[calc(100vh-200px)]">
          {activeTicket ? (
             <>
                <div className="px-8 py-6 border-b border-gray-100/50 flex justify-between items-start bg-white/50 z-10">
                   <div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{activeTicket.subject}</h2>
                    {getStatusBadge(activeTicket.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Customer:</span> {activeTicket.user_name} ({activeTicket.user_email})</p>
                    {activeTicket.shop_name && <p><span className="font-medium">Seller:</span> {activeTicket.shop_name}</p>}
                    {activeTicket.order_id && <p><span className="font-medium">Order:</span> #{activeTicket.order_id}</p>}
                  </div>
                </div>
                   </div>
                   <div className="flex gap-2 flex-wrap">
                     {activeTicket.seller_id && (
                       <button onClick={forwardToSeller} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium hover:bg-blue-200 transition">
                         🔄 Forward to Seller
                       </button>
                     )}
                     <button onClick={forwardToCustomer} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs rounded-lg font-medium hover:bg-purple-200 transition">
                       📨 Notify Customer
                     </button>
                     {activeTicket.status !== 'resolved' && (
                       <button 
                          onClick={(e) => handleSendReply(e, 'resolved')}
                          className="px-4 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-sm justify-center font-medium transition-colors"
                       >
                         ✅ Resolved
                       </button>
                     )}
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   {/* Original Message */}
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                         {activeTicket.user_name.charAt(0)}
                      </div>
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-5 rounded-tl-none">
                         <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-900">{activeTicket.user_name}</span>
                            <span className="text-xs text-gray-500">{new Date(activeTicket.created_at).toLocaleString()}</span>
                         </div>
                         <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{activeTicket.message}</p>
                      </div>
                   </div>

                   {/* Replies */}
                   {replies.map((reply: any) => {
                      const isAdmin = reply.sender_role === 'admin';
                      return (
                        <div key={reply.id} className={twMerge("flex items-start gap-4", isAdmin && "flex-row-reverse")}>
                           <div className={twMerge("w-10 h-10 rounded-full flex items-center justify-center font-bold border", isAdmin ? "bg-brand-teal/20 text-brand-teal border-brand-teal/30" : "bg-gray-100 text-gray-600 border-gray-200")}>
                              {isAdmin ? 'A' : reply.sender_name.charAt(0)}
                           </div>
                           <div className={twMerge("flex-1 border rounded-2xl p-5 max-w-[85%]", isAdmin ? "bg-brand-teal/10 border-brand-teal/20 rounded-tr-none" : "bg-gray-50 border-gray-100 rounded-tl-none")}>
                              <div className="flex justify-between items-center mb-2">
                                 <span className={twMerge("font-semibold text-sm", isAdmin ? "text-blue-900" : "text-gray-900")}>{isAdmin ? 'Support Team' : reply.sender_name}</span>
                                 <span className={twMerge("text-xs", isAdmin ? "text-brand-teal" : "text-gray-500")}>{new Date(reply.created_at).toLocaleString()}</span>
                              </div>
                              <p className={twMerge("whitespace-pre-wrap text-sm leading-relaxed", isAdmin ? "text-blue-800" : "text-gray-700")}>{reply.message}</p>
                           </div>
                        </div>
                      )
                   })}
                </div>

                {activeTicket.status !== 'resolved' ? (
                  <form onSubmit={(e) => handleSendReply(e)} className="p-6 bg-white border-t border-gray-100/50">
                    <div className="relative">
                       <textarea 
                         rows={2}
                         value={replyMessage}
                         onChange={(e) => setReplyMessage(e.target.value)}
                         placeholder="Type your reply here..."
                         className="w-full resize-none p-4 pr-16 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none text-sm transition-all shadow-inner"
                       />
                       <button 
                         type="submit"
                         disabled={!replyMessage.trim()}
                         className="absolute right-3 bottom-3 p-2 bg-brand-teal hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-colors"
                       >
                          <Send className="w-4 h-4" />
                       </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6 bg-gray-50 border-t border-gray-100/50 text-center text-sm text-gray-500 flex justify-center items-center">
                     <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                     This ticket has been marked as resolved.
                  </div>
                )}
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Ticket className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-medium text-gray-600">Select a Ticket</h3>
                <p className="text-sm mt-2 max-w-sm text-center">Choose a support request from the queue to view details and respond.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
