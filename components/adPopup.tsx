"use client";

import { useState, useEffect } from "react";

export default function AdPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Cek apakah iklan sudah muncul di sesi ini
    const hasSeenAd = sessionStorage.getItem("lara_ad_shown");
    
    // Beri sedikit delay agar transisi setelah login lebih mulus (misal: 1 detik)
    if (!hasSeenAd) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("lara_ad_shown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    // Overlay transparan full screen, onClick di div ini akan menutup popup
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer p-4"
      onClick={() => setShow(false)}
    >
      {/* Kontainer Gambar */}
      <div className="relative w-full max-w-sm md:max-w-md transform transition-all duration-300 scale-100">
        
        {/* Tombol Close X */}
        <button 
          className="absolute -top-4 -right-4 bg-white text-black w-8 h-8 rounded-full font-black text-sm shadow-xl flex items-center justify-center hover:bg-gray-200 z-10"
        >
          X
        </button>

        {/* Gambar Iklan (Ganti URL dengan gambar iklan asli LARA) */}
        <img 
          src="/images/G&B.png" 
          alt="Promo LARA Fragrance" 
          className="w-full h-auto rounded-[20px] shadow-2xl object-cover"
        />
      </div>
    </div>
  );
}