"use client";

import { useEffect, useState } from 'react';
import { MessageSquare, Send, Search, User, MoreVertical, Package, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function SellerMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetch('/api/seller/chat', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
         if (json.success) {
           setConversations(json.conversations || []);
         }
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadConversation = async (conv: any) => {
    setActiveChat(conv);
    setChatLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/seller/chat?orderId=${conv.order_id}`, {
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

  const handleEscalateToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const subject = `Order #${activeChat.order_id} - Customer communication via seller`;

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/seller/chat', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: activeChat.customer_id || 0,
          order_id: activeChat.order_id,
          content: newMessage
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Ticket #${data.ticket_id} created with admin. They will mediate with customer.`);
        setNewMessage('');
        // Reload conversation to show ticket
        if (activeChat.order_id) loadConversation(activeChat);
      }
    } catch(err) {
      console.error(err);
      alert('Error creating ticket. Please try again.');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Messages</h1>
        <p className="text-gray-500 mt-2">Communicate directly with buyers regarding their orders.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-soft overflow-hidden flex relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent"></div>
        
        {/* Sidebar Conversations List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white/50 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders or customers..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-gray-50 focus:ring-1 focus:ring-brand-teal text-gray-800 outline-none text-sm transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
               <div className="p-10 flex justify-center"><div className="w-6 h-6 rounded-full border-b-2 border-l-2 border-brand-teal animate-spin"></div></div>
            ) : conversations.length > 0 ? (
               conversations.map((conv: any, i) => (
                 <button 
                  key={i} 
                  onClick={() => loadConversation(conv)}
                  className={twMerge(
                    "w-full text-left p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors border-b border-gray-100",
                    activeChat?.order_id === conv.order_id && "bg-gray-50/80 border-l-2 border-l-brand-teal"
                  )}
                 >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-200">
                       <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{conv.customer_name || 'Customer'}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                             {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                       </div>
                       <p className="text-xs text-gray-500 truncate mb-1.5">{conv.content}</p>
                       <div className="flex items-center text-[10px] text-brand-teal font-medium">
                          <Package className="w-3 h-3 mr-1" /> Order #{conv.order_id}
                       </div>
                    </div>
                 </button>
               ))
            ) : (
               <div className="p-10 text-center text-gray-400 text-sm">No active conversations.</div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white/30">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">{activeChat.customer_name || 'Customer'}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Package className="w-3 h-3 mr-1" /> Referring to Order #{activeChat.order_id}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                {chatLoading ? (
                  <div className="flex-1 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-b-2 border-l-2 border-brand-teal animate-spin"></div></div>
                ) : messages.length > 0 ? (
                   messages.map((msg: any, idx) => {
                     const isSeller = msg.sender_role === 'seller';
                     return (
                       <div key={idx} className={twMerge("flex w-full", isSeller ? "justify-end" : "justify-start")}>
                          <div className={twMerge(
                            "max-w-[70%] rounded-2xl p-4 shadow-sm text-sm",
                            isSeller 
                             ? "bg-brand-teal text-gray-900 rounded-tr-sm border border-brand-teal shadow-glow" 
                             : "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-200"
                          )}>
                             <p>{msg.content}</p>
                             <div className={twMerge("flex items-center text-[10px] mt-2 opacity-70", isSeller ? "justify-end text-teal-700" : "justify-start text-gray-500")}>
                               <Clock className="w-3 h-3 mr-1" />
                               {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                       </div>
                     )
                   })
                ) : (
                   <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No messages yet. Send a greeting!</div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
              <div className="space-y-2">
                <p className="text-xs text-gray-500 italic px-4 pb-2">
                  💬 Direct messaging disabled for customer privacy. Escalate to admin support.
                </p>
                <form onSubmit={handleEscalateToAdmin} className="flex gap-3 relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message for admin to forward..." 
                    className="flex-1 bg-orange-50 border border-orange-200 rounded-xl py-3 px-4 text-sm text-gray-900 focus:ring-1 focus:ring-orange-400 outline-none placeholder:text-gray-500"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white p-3 rounded-xl transition-all shadow-sm flex items-center justify-center"
                  >
                    📤 Escalate
                  </button>
                </form>
              </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <MessageSquare className="w-16 h-16 text-brand-teal/20 mb-4" />
               <h3 className="text-lg font-medium text-gray-700">Your Messages</h3>
               <p className="text-sm mt-2 max-w-sm text-center">Select a conversation from the sidebar to view message history and reply to your customers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
