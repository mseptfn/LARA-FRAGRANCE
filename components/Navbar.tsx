"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);

  // Mengecek status login user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Anda telah berhasil logout.");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {/* Top Promo Banner */}
      <div className="bg-black text-white text-[11px] md:text-xs text-center py-2 md:py-2.5 font-semibold tracking-[0.15em] uppercase">
        Enjoy Free Shipping on Orders Over Rp 500.000
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between bg-white">
        
        {/* Left: Hamburger (Mobile) & Logo + Search */}
        <div className="flex-1 flex items-center">
          <button className="md:hidden mr-4 text-gray-800 hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center text-[#004236] font-serif text-2xl font-bold -ml-16 mr-20">
              <img 
                src="/images/logo2.png" 
                alt="Logo" 
                className="h-24 w-auto object-contain scale-[2] origin-left" 
              />
            </Link>

            <div className="flex items-center space-x-2 text-gray-600 hover:text-black cursor-pointer group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="text-[13px] font-bold tracking-wider uppercase">Search</span>
            </div>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 text-center">
          <Link href="/" className="text-2xl md:text-[32px] font-black tracking-tighter text-[#000000] uppercase">
            LARA Fragrance
          </Link>
        </div>

        {/* Right: User & Cart Icons */}
        <div className="flex-1 flex justify-end items-center space-x-5 md:space-x-7">
          
          {/* LOGIKA CONDITIONAL LOGIN/LOGOUT */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              
              {/* TOMBOL PESANAN SAYA - HANYA MUNCUL JIKA SUDAH LOGIN */}
              <Link 
                href="/track-order" 
                className="text-[13px] font-bold tracking-wider uppercase text-[#004236] hover:text-black hover:underline transition"
              >
                Pesanan Saya
              </Link>
              
              <span className="text-[13px] font-bold tracking-wider uppercase text-[#000000] border-l-2 border-gray-200 pl-4">
                Hi, {user.email?.split('@')[0]}
              </span>
              
              <button 
                onClick={handleLogout} 
                className="text-[11px] font-bold tracking-wider uppercase text-red-500 hover:text-red-700 transition hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-black group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="text-[13px] font-bold tracking-wider uppercase hidden lg:block">Sign In</span>
            </Link>
          )}
          
          {/* Ikon Keranjang */}
          <Link href="/cart" className="relative cursor-pointer text-gray-800 hover:text-[#004236] flex items-center group">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-[#b51c1c] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="hidden md:flex justify-center space-x-10 py-3.5 border-t border-gray-100 bg-white">
        {["New", "Body", "Fragrance", "Bundling"].map((item) => (
          <Link 
            key={item} 
            href={`/${item.toLowerCase()}`} 
            className={`text-[13px] font-bold uppercase tracking-[0.1em] transition-colors pb-1 border-b-2 border-transparent hover:border-[#004236] hover:text-[#004236] ${item === 'Fragrance' ? 'border-[#004236] text-[#004236]' : 'text-gray-700'}`}
          >
            {item}
          </Link>
        ))}
      </nav>
    </header>
  );
}