"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import AdPopup from "@/components/adPopup"; // Import komponen pop-up

const ProductSkeleton = () => (
  <div className="flex flex-col bg-white p-2 shadow-sm rounded-sm">
    <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse mb-3"></div>
    <div className="h-4 bg-gray-100 animate-pulse mb-2 rounded w-3/4"></div>
    <div className="h-3 bg-gray-100 animate-pulse mb-3 rounded w-1/2"></div>
    <div className="h-4 bg-gray-100 animate-pulse mb-4 rounded w-1/3 mt-auto"></div>
    <div className="h-10 bg-gray-100 animate-pulse rounded w-full"></div>
  </div>
);

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); 

  // 1. STATE UNTUK SLIDER
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    "/images/banner.jpg", 
    "/images/banner2.jpg", 
    "/images/banner3.jpg"
  ];

  // 2. EFEK UNTUK GESER OTOMATIS TIAP 3 DETIK
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000); 

    return () => clearInterval(slideInterval);
  }, [banners.length]);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); 
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeTab === "All") return true;
    return product.gender === activeTab;
  });

  return (
    <div className="min-h-screen bg-pink-50">
      
      {/* PANGGIL KOMPONEN POP-UP DI SINI */}
      <AdPopup />

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        {/* HERO BANNER SECTION (Full Width Slider) */}
        <div className="relative mb-12 overflow-hidden rounded-sm mx-auto max-w-[851px] h-[150px] sm:h-[200px] md:h-[315px]">
          {/* Wadah yang bergerak ke kiri/kanan */}
          <div 
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((src, index) => (
              <img 
                key={index}
                src={src} 
                alt={`Banner ${index + 1}`} 
                className="w-full h-full object-cover object-center flex-shrink-0"
              />
            ))}
          </div>

          {/* Titik-titik Navigasi (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </div>

        {/* TITLE & TAB FILTER */}
        <div className="mb-8 mt-12">
          <h2 className="text-2xl md:text-3xl font-black text-[#5c3331] uppercase tracking-widest mb-4 text-center md:text-left">
            New Arrivals Products
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center py-4 px-1 border-t border-b border-gray-200/60 gap-4 md:gap-0">
            <span className="text-sm text-gray-600 font-bold tracking-wide">
              {loading ? "..." : filteredProducts.length} LATEST PRODUCTS
            </span>

            <div className="flex space-x-2 md:space-x-3">
              {["All", "Women", "Gentlemen"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs md:text-sm font-bold px-4 md:px-6 py-2 border transition duration-300 uppercase tracking-widest ${
                    activeTab === tab
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md"
                      : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {tab === "All" ? "View All" : `For ${tab}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
          {loading ? (
            Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            filteredProducts.map((product, index) => (
              <div key={product.id} className="group flex flex-col relative bg-white transition hover:shadow-lg p-2 rounded-sm shadow-sm border border-gray-100">
                
                {(product.label === 'NEW' || index < 4) && (
                  <div className="absolute top-4 left-4 text-white text-[10px] md:text-xs font-bold px-3 py-1 z-10 tracking-widest bg-[#5c3331]">
                    NEW
                  </div>
                )}
                {product.label === 'BESTSELLER' && index >= 4 && (
                  <div className="absolute top-4 left-4 text-white text-[10px] md:text-xs font-bold px-3 py-1 z-10 tracking-widest bg-[#b88c3e]">
                    BESTSELLER
                  </div>
                )}

                <div className="relative w-full aspect-[4/5] bg-[#f7f7f7] mb-4 flex items-center justify-center p-3 md:p-5">
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop"} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  />
                </div>

                <div className="flex flex-col flex-grow px-2">
                  <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-medium min-h-[16px]">
                    {product.category}
                  </p>
                  
                  <h3 className="font-bold text-gray-900 text-[13px] md:text-sm leading-snug mb-2 line-clamp-2 min-h-[38px]">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-3">
                    <p className="font-bold text-gray-900 text-sm md:text-base mb-5">
                      Rp {product.price?.toLocaleString("id-ID")}
                    </p>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full border border-gray-900 bg-white text-gray-900 text-xs md:text-sm font-bold py-3 uppercase tracking-widest transition duration-300 group-hover:bg-[#1a1a1a] group-hover:text-white"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">No products found. Start adding some from the Admin Panel!</p>
          </div>
        )}
      </main>

      {/* CUSTOMER REVIEWS SECTION */}
      <div className="bg-[#fae9e8] py-16 md:py-20 px-4 md:px-8 mt-12 border-t border-white/60">
        <div className="max-w-7xl mx-auto text-center">
          
          <h2 className="text-3xl md:text-4xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            What They Say
          </h2>
          <p className="text-sm md:text-base text-[#5c3331] mb-12 max-w-xl mx-auto leading-relaxed">
            Discover why our customers fall in love with their LARA Fragrance experience. Real reviews from real buyers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
            
            {/* Review Card 1 */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="flex text-[#b88c3e] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed mb-6 flex-grow">
                "Wanginya bener-bener mewah dan tahan seharian! Awalnya iseng nyoba karena racun TikTok, eh malah keterusan. Packaging-nya juga cantik banget buat kado."
              </p>
              <div>
                <div className="font-bold text-[#5c3331] text-xs uppercase tracking-widest mb-1">Amanda T.</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-600"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Verified Buyer
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="flex text-[#b88c3e] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed mb-6 flex-grow">
                "Jarang banget nemu parfum lokal yang vibes-nya sekelas brand designer. Buat dipake ngantor cocok banget, aromanya ngga bikin pusing dan dapet banyak pujian dari temen."
              </p>
              <div>
                <div className="font-bold text-[#5c3331] text-xs uppercase tracking-widest mb-1">Sarah Wijaya</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-600"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Verified Buyer
                </div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="flex text-[#b88c3e] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed mb-6 flex-grow">
                "Pengirimannya super cepet dan aman banget pake bubble wrap tebel. Varian yang Vanilla bener-bener soft dan ngga nyegrak. Bakal repurchase buat koleksi aroma lainnya!"
              </p>
              <div>
                <div className="font-bold text-[#5c3331] text-xs uppercase tracking-widest mb-1">Dina Putri</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-600"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                  Verified Buyer
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}