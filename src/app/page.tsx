"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Heart, Sparkles, ShoppingCart, Truck, ShieldCheck, RefreshCw, Headset, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8892bc952f?q=80&w=400&auto=format&fit=crop', link: '/category/birthday' },
  { name: 'Anniversary', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop', link: '/category/anniversary' },
  { name: 'Love & Romance', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop', link: '/category/love' },
  { name: 'Personalized', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop', link: '/category/personalized' },
  { name: 'Jewellery', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop', link: '/category/jewellery' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop', link: '/category/home-decor' },
];

const CATEGORY_SUBTITLES: Record<string, string> = {
  "HandiCrafts": "Timeless artistry crafted by skilled hands",
  "Home Decors": "Elevate your living space with unique styles",
  "Festivals": "Celebrate the warmth & joy of every season",
  "Art and Painting": "Expressive visuals that inspire the soul",
  "Jewellery": "Adorn yourself with elegant handcrafted designs",
  "Love & Romance": "Meaningful gifts to express your deepest feelings",
  "Personalise": "Make it truly yours with custom touches",
  "Birthday Gift": "Perfect surprises to brighten up their special day"
};

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Personalized Photo Lamp', price: 1499, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', category: 'Personalized' },
  { id: 2, name: 'Red Roses Bouquet', price: 899, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop', category: 'Love & Romance' },
  { id: 3, name: 'Luxury Spa Hamper', price: 2499, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop', category: 'Anniversary' },
  { id: 5, name: 'Handcrafted Wooden Watch', price: 3499, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop', category: 'Gifts' },
  { id: 6, name: 'Engraved Silver Pendant', price: 1999, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop', category: 'Jewellery' },
];

export default function Home() {
  const [categories, setCategories] = useState<{name: string, originalName?: string, products: any[]}[]>([{ name: 'Trending Expressions', products: FEATURED_PRODUCTS }]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const HERO_SLIDES = [
    {
      image: "/hero-slider-1.png",
      tag: "Curated with Love",
      title: "Premium Handcrafted <br /> Gift Collections",
      description: "Discover our aesthetically pleasing, handcrafted gifts that speak to the soul.",
      btnText: "Explore Gifts",
      link: "/shop"
    },
    {
      image: "/hero-slider-2.png",
      tag: "Special Moments",
      title: "Make Every Occasion <br /> Unforgettable",
      description: "Send warmth and affection with our beautifully packaged, premium gift hampers.",
      btnText: "Shop Hampers",
      link: "/category/personalized"
    },
    {
      image: "/hero-slider-3.png",
      tag: "Elegant Living",
      title: "Transform Your Space <br /> with Handcrafted Decor",
      description: "Bring warmth and character to your home with our artisanal mandalas, candles, and decor pieces.",
      btnText: "Shop Home Decor",
      link: "/category/home-decor"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
           const grouped = data.reduce((acc: any, p: any) => {
             const cat = p.category_name || 'Trending Gifts';
             if (!acc[cat]) acc[cat] = [];
             if (acc[cat].length < 6) acc[cat].push(p);
             return acc;
           }, {});
           
           const categoryMapping: Record<string, string> = {
             "handicrafts": "HandiCrafts",
             "home decor": "Home Decors",
             "festival & festive": "Festivals",
             "art & paintings": "Art and Painting",
             "jewellery & accessories": "Jewellery",
             "love & romance": "Love & Romance",
             "personalized gifts": "Personalise",
             "birthday": "Birthday Gift"
           };

           const order = [
             "HandiCrafts",
             "Home Decors",
             "Festivals",
             "Art and Painting",
             "Jewellery",
             "Love & Romance",
             "Personalise",
             "Birthday Gift"
           ];

           const newCategories = Object.keys(grouped).map(k => {
             const lowerK = k.toLowerCase().trim();
             const displayName = categoryMapping[lowerK] || k;
             return {
               name: displayName,
               originalName: k,
               products: grouped[k]
             };
           }).sort((a, b) => {
             let aIndex = order.indexOf(a.name);
             let bIndex = order.indexOf(b.name);
             if (aIndex === -1) aIndex = 999;
             if (bIndex === -1) bIndex = 999;
             if (aIndex !== bIndex) return aIndex - bIndex;
             return a.name.localeCompare(b.name);
           });
           setCategories(newCategories);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Slider */}
      <section className="w-full">
        <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden group">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image 
                src={slide.image} 
                alt={slide.tag || 'Hero Slide'} 
                fill
                priority={index === 0}
                quality={100}
                className={`object-cover transition-transform duration-[10000ms] ease-linear ${
                  index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
              />
              {slide.title && <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>}
              
              <div className="absolute inset-0 flex flex-col justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="w-full sm:max-w-xl md:pl-8">
                    {slide.tag && (
                      <motion.span 
                        key={`tag-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-brand-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-4 bg-white/90 w-max px-4 py-1.5 rounded-full shadow-sm block"
                      >
                        {slide.tag}
                      </motion.span>
                    )}
                    {slide.title && (
                      <motion.h1 
                        key={`title-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight"
                        dangerouslySetInnerHTML={{ __html: slide.title }}
                      />
                    )}
                    {slide.description && (
                      <motion.p 
                        key={`desc-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-white/90 mb-8 max-w-lg"
                      >
                        {slide.description}
                      </motion.p>
                    )}
                    {slide.btnText && (
                      <motion.div
                        key={`btn-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <Link href={slide.link} className="w-max inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-medium hover:bg-[#d63b63] transition-all shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-1">
                          {slide.btnText} <ArrowRight size={18} />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide ? 'w-8 h-2 bg-brand-primary' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Truck size={24} />
            </div>
            <div className="mt-1 sm:mt-0">
              <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
              <p className="text-xs text-gray-500 mt-0.5">On orders over ₹499</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="mt-1 sm:mt-0">
              <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-500 mt-0.5">100% Protected</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <RefreshCw size={24} />
            </div>
            <div className="mt-1 sm:mt-0">
              <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">7-Day return policy</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <Headset size={24} />
            </div>
            <div className="mt-1 sm:mt-0">
              <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
              <p className="text-xs text-gray-500 mt-0.5">Always here for you</p>
            </div>
          </div>
        </div>
      </section>


      <div className="">
        {categories.map((categoryGroup, index) => (
          <section key={index} className={`py-10 ${index % 2 === 0 ? 'bg-surface-light' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">{categoryGroup.name}</h2>
                  <p className="text-gray-500">{CATEGORY_SUBTITLES[categoryGroup.name] || "Discover our best curated selections"}</p>
                </div>
                <Link href={`/shop?category=${encodeURIComponent(categoryGroup.originalName || categoryGroup.name)}`} className="hidden md:flex items-center gap-2 text-brand-primary font-medium hover:underline">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                {categoryGroup.products.map((product: any, pIndex: number) => {
                  let parsedImages: string[] = [];
                  if (typeof product.images === 'string') {
                    try { parsedImages = JSON.parse(product.images); } catch(e){}
                  } else if (Array.isArray(product.images)) {
                    parsedImages = product.images;
                  }
                  const displayImage = parsedImages.length > 0 ? parsedImages[0] : (product.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop');

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (pIndex % 6) * 0.1 }}
                      className="group flex flex-col bg-white p-3 rounded-[12px] shadow-sm border border-gray-50 hover:shadow-[0_8px_25px_rgba(233,78,119,0.12)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="relative overflow-hidden rounded-xl mb-3 aspect-[4/5] bg-brand-base border border-gray-50">
                        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                          <Image 
                            src={displayImage} 
                            alt={product.title || product.name || 'Product'} 
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        </Link>
                        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10">
                          <button className="pointer-events-auto bg-brand-primary/90 backdrop-blur-sm text-white px-4 py-2 w-full rounded-lg text-sm font-medium hover:bg-[#d63b63] transition-colors shadow-sm flex items-center justify-center gap-2">
                            <ShoppingCart size={16} /> Add
                          </button>
                        </div>
                        <button className="absolute z-10 top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-brand-primary hover:bg-white transition-all shadow-sm">
                          <Heart size={16} />
                        </button>
                        <div className="absolute z-10 top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-600 shadow-sm pointer-events-none">
                          {product.category_name || product.category || 'Gifts'}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-800 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                          <Link href={`/product/${product.id}`}>{product.title || product.name}</Link>
                        </h3>
                        <p className="text-brand-accent font-bold mt-auto pt-1 text-sm md:text-base">
                          ₹{product.special_price ? product.special_price : product.price}
                          {Number(product.special_price) < Number(product.price) && (
                             <span className="text-xs text-gray-400 line-through ml-2 font-normal">₹{product.price}</span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Newsletter Section */}
      <section className="py-12 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <Image src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1920&auto=format&fit=crop" alt="Pattern" fill className="object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Mail className="w-12 h-12 text-white/90 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Join the WeSoul Family</h2>
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and get 10% off your first order. Plus, receive early access to new collections and exclusive sales!
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
              required
            />
            <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors whitespace-nowrap shadow-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-surface-light py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Handmade Products Online at WeSoulGifts</h2>
            <p className="mb-4 text-justify">
              If you’re looking to explore the beauty of handmade products online, WeSoulGifts is your perfect destination. From handcrafted home décor and artistic paintings to customized gifts, fashion items, and unique jewellery — we bring you a carefully curated collection of creative products made with love by skilled artisans across India.
            </p>
            <p className="mb-4 text-justify">
              At WeSoulGifts, we believe that every handmade product tells a story. Our platform connects talented local creators with people who appreciate originality, craftsmanship, and authenticity. Whether you're decorating your home or searching for a meaningful gift, you’ll find something truly special here.
            </p>
            <p className="mb-6 text-justify">
              Shop easily from the comfort of your home and get your favorite handmade items delivered straight to your doorstep. By choosing WeSoulGifts, you’re not just buying a product — you’re supporting local artisans and their art.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">India’s Trusted Platform for Buying & Selling Handmade Products</h3>
            <p className="mb-6 text-justify">
              WeSoulGifts is more than just a marketplace — it’s a community for creators and buyers. Whether it’s home décor, customized gifts, or fashion accessories, we offer a wide range of unique handmade items that suit every taste and occasion.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Explore Our Categories</h3>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">🎨 Handmade Paintings</h4>
            <p className="mb-4 text-justify">
              Our collection of paintings is perfect for art lovers. Discover acrylic paintings, canvas art, digital illustrations, sketches, portraits, and more — all crafted by talented artists. Add elegance and personality to your space with our exclusive artworks.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">🏡 Home Décor & Living</h4>
            <p className="mb-4 text-justify">
              Upgrade your home with beautifully handcrafted décor items such as wall hangings, showpieces, clocks, vases, cushions, and scented candles. We also offer kitchen essentials like trays, plates, bowls, shelves, furniture, and rugs — all designed to give your home a unique touch.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">👗 Fashion Collection</h4>
            <p className="mb-4 text-justify">
              Explore our stylish range of handmade fashion products including sarees, kurtis, dupattas, scarves, and T-shirts. We also offer men’s fashion items like kurtas and T-shirts, along with eco-friendly fabric bags.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">💍 Jewellery & Accessories</h4>
            <p className="mb-4 text-justify">
              Our handmade jewellery collection features elegant designs made from terracotta, clay, beads, threads, and other materials. Each piece is crafted with precision to give you a unique and stylish look.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 mb-2">🎁 Customized Gifts</h4>
            <p className="mb-4 text-justify">
              Looking for something personal? WeSoulGifts specializes in customized gifts. From cushions, mugs, and keychains to wall clocks and accessories — we offer personalized items perfect for every occasion.
            </p>
            <p className="text-justify font-medium text-gray-800">
              We also provide corporate gifting solutions at affordable prices for bulk orders.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
