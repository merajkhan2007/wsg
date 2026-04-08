'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-base pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] text-white py-24 px-6 sm:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light mb-6 font-serif tracking-tight"
          >
            Let's <span className="font-semibold italic">Connect</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Whether you have a question about our curated gifts, need assistance with your order, or just want to say hello, we're here for you.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 space-y-6"
          >
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col h-full">
              <h3 className="text-2xl font-serif font-semibold mb-8 text-neutral-900 border-b border-neutral-100 pb-4">Our Contact Details</h3>
              
              <div className="space-y-8 flex-grow">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-brand-base group-hover:bg-accent/10 transition-colors rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="w-5 h-5 text-neutral-600 group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Head Office</h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      Aali Village, Sarita Vihar<br />
                      New Delhi, 110076
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-brand-base group-hover:bg-accent/10 transition-colors rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Mail className="w-5 h-5 text-neutral-600 group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Email Us</h4>
                    <a href="mailto:support@wesoulgifts.com" className="text-neutral-500 text-sm hover:text-accent transition-colors">support@wesoulgifts.com</a>
                    <br />
                    <a href="mailto:partnerships@wesoulgifts.com" className="text-neutral-500 text-sm hover:text-accent transition-colors">partnerships@wesoulgifts.com</a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-brand-base group-hover:bg-green-100 transition-colors rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <MessageCircle className="w-5 h-5 text-neutral-600 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">WhatsApp Us</h4>
                    <a href="https://wa.me/917595989813" target="_blank" rel="noopener noreferrer" className="text-neutral-500 text-sm hover:text-green-600 transition-colors">Chat with us on WhatsApp</a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-brand-base group-hover:bg-accent/10 transition-colors rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Clock className="w-5 h-5 text-neutral-600 group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">Working Hours</h4>
                    <p className="text-neutral-500 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-neutral-500 text-sm">Sat - Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-2/3"
          >
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-semibold text-neutral-900 mb-4">Message Sent!</h3>
                  <p className="text-neutral-500 max-w-md">
                    Thank you for reaching out. We have received your message and our team will get back to you within 24-48 hours.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-serif font-semibold text-neutral-900 mb-2">Send us a Message</h2>
                    <p className="text-neutral-500">Please fill out the form below and we'll be in touch shortly.</p>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-neutral-700">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-3 bg-brand-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-3 bg-brand-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-neutral-700">Subject *</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-3 bg-brand-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-neutral-700">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-3 bg-brand-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none resize-none"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>

                  <div className="flex justify-center mt-8">
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-dark transition-colors flex items-center justify-center min-w-[200px]"
                    >
                      {status === 'submitting' ? (
                        <span className="flex items-center gap-2">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message <Send className="w-4 h-4 ml-1" />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 mt-20">
        <div className="w-full h-[400px] bg-neutral-200 rounded-2xl overflow-hidden relative border border-neutral-100">
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 flex-col gap-4 text-neutral-400">
            <MapPin className="w-12 h-12" />
            <span className="font-medium tracking-wide">Interactive Map Integration</span>
          </div>
        </div>
      </section>
    </div>
  );
}
