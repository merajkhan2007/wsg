"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = localStorage.getItem('cart');
    if (existing) setItems(JSON.parse(existing));
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const address = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('zip')}`;
      const phone = formData.get('phone');

      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!user || !token) {
        alert("Please login to complete your order");
        router.push('/login');
        setIsProcessing(false);
        return;
      }
      
      const parsedUser = JSON.parse(user);
      
      if (paymentMethod === 'Razorpay') {
        // 1. Create Razorpay order back end
        const rzpRes = await fetch('/api/orders/razorpay', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount: total })
        });
        const rzpOrder = await rzpRes.json();

        if (!rzpRes.ok) {
           alert(rzpOrder.error || "Could not initialize payment");
           setIsProcessing(false);
           return;
        }

        // 2. Open Razorpay Checkout
        const options = {
            key: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').replace(/['"]/g, '').trim(), 
            amount: rzpOrder.amount, 
            currency: "INR",
            name: "WeSoulGifts",
            description: "Premium Gifts Order",
            order_id: rzpOrder.id,
            handler: async function (response: any) {
                // 3. Complete actual order on success
                const res = await fetch('/api/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    user_id: parsedUser.id,
                    items: items.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
                    total_amount: total,
                    address,
                    phone,
                    payment_method: 'Razorpay',
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });
                
                if (res.ok) {
                  const orderData = await res.json();
                  setPlacedOrderId(orderData.id);
                  localStorage.removeItem('cart');
                  window.dispatchEvent(new Event('cart_updated'));
                  setIsSuccess(true);
                } else {
                  alert("Failed to confirm order with server.");
                }
                setIsProcessing(false);
            },
            prefill: {
                name: (formData.get('firstName') as string) + " " + (formData.get('lastName') as string),
                email: formData.get('email') as string,
                contact: phone as string
            },
            theme: {
                color: "#ff5a1f"
            }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
           alert("Payment failed: " + response.error.description);
           setIsProcessing(false);
        });
        rzp1.open();
      } else {
        // COD path
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: parsedUser.id,
            items: items.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
            total_amount: total,
            address,
            phone,
            payment_method: 'COD'
          })
        });
        
        if (res.ok) {
          const orderData = await res.json();
          setPlacedOrderId(orderData.id);
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cart_updated'));
          setIsSuccess(true);
        } else {
          alert("Failed to place order. Please try again.");
        }
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface-light px-4">
        <div className="bg-white p-12 rounded-3xl shadow-soft border border-gray-100 max-w-lg w-full text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for shopping with WeSoulGifts. Your order has been placed successfully. A confirmation email has been sent to you.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100 text-left text-sm text-gray-500 space-y-2">
            <div className="flex justify-between"><span>Order Number:</span> <span className="font-semibold text-gray-900">#WSG-{placedOrderId ? String(placedOrderId).padStart(4, '0') : '0000'}</span></div>
            <div className="flex justify-between"><span>Estimated Delivery:</span> <span className="font-semibold text-gray-900">3 Days</span></div>
          </div>
          <Link href="/shop" className="bg-brand-primary text-white px-8 py-3 rounded-full font-medium hover:bg-[#d63b63] transition-all flex justify-center items-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <div className="min-h-screen bg-surface-light pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Cart
        </Link>
        <div className="flex gap-2 mb-8 items-center text-sm font-medium text-brand-primary uppercase tracking-widest">
           <ShieldCheck size={18} /> Secure Checkout
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Delivery details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input required name="phone" type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Shipping Address</label>
                <input required name="address" type="text" placeholder="Street address, P.O. box, etc." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all mb-4" />
                <div className="grid grid-cols-2 gap-4">
                   <input required name="city" type="text" placeholder="City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                   <input required name="zip" type="text" placeholder="Postal Code" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Payment Method</h2>
                 <div className="space-y-4">
                    {/* Razorpay Option */}
                    <div 
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'Razorpay' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Razorpay' ? 'border-brand-primary border-[6px]' : 'border-gray-300'}`}></div>
                         <div className="flex gap-2 items-center">
                            <CreditCard size={20} className={paymentMethod === 'Razorpay' ? 'text-brand-primary' : 'text-gray-500'} />
                            <span className={`font-semibold text-sm ${paymentMethod === 'Razorpay' ? 'text-gray-900' : 'text-gray-600'}`}>Pay Online (Credit Card / UPI / Wallets)</span>
                         </div>
                      </div>
                      <div className="flex gap-1 opacity-80">
                        <div className="w-8 h-5 bg-gray-200 rounded bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg')] bg-cover bg-center"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg')] bg-cover bg-center"></div>
                      </div>
                    </div>

                    {/* COD Option */}
                    <div 
                      onClick={() => setPaymentMethod('COD')}
                      className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-brand-primary border-[6px]' : 'border-gray-300'}`}></div>
                         <div className="flex gap-2 items-center">
                            <Banknote size={20} className={paymentMethod === 'COD' ? 'text-brand-primary' : 'text-gray-500'} />
                            <span className={`font-semibold text-sm ${paymentMethod === 'COD' ? 'text-gray-900' : 'text-gray-600'}`}>Cash on Delivery (COD)</span>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>

              <button type="submit" disabled={items.length === 0 || isProcessing} className="w-full bg-brand-accent text-white py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors shadow-glow mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                 {isProcessing ? 'Processing... ' : `Pay ₹${total}`}
              </button>
            </form>
          </div>
          
          {/* Summary Sidebar placeholder for checkout */}
          <div className="hidden lg:block bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
             <div className="flex flex-col gap-6">
                {!mounted ? (
                  <div className="space-y-6 animate-pulse">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex gap-4">
                         <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0"></div>
                         <div className="flex-1 flex flex-col justify-center">
                           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                           <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                           <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                         </div>
                       </div>
                     ))}
                  </div>
                ) : items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-500 mb-1">Qty: {item.quantity}</p>
                      <p className="font-semibold text-brand-primary">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span> <span className="font-medium">₹{subtotal}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span> <span className="font-medium text-green-600">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-xl text-gray-900">
                  <span>Total</span> <span className="text-brand-primary">₹{total}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
