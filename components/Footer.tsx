import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#ffffff] pt-16 pb-8 px-4 md:px-8 border-t border-white/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 text-sm">
        
        {/* ABOUT US */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-black text-[#5c3331] uppercase tracking-widest mb-2 text-xs md:text-sm">About Us</h4>
          <Link href="/our-story" className="text-gray-600 hover:text-[#5c3331] transition-colors">Our Story</Link>
          <Link href="/ingredients" className="text-gray-600 hover:text-[#5c3331] transition-colors">Discover Our Ingredients</Link>
          <Link href="/sustainability" className="text-gray-600 hover:text-[#5c3331] transition-colors">Sustainability Commitments</Link>
          <Link href="/careers" className="text-gray-600 hover:text-[#5c3331] transition-colors">Careers</Link>
        </div>

        {/* HELP */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-black text-[#5c3331] uppercase tracking-widest mb-2 text-xs md:text-sm">Help</h4>
          <Link href="/contact" className="text-gray-600 hover:text-[#5c3331] transition-colors">Contact Us</Link>
          <Link href="/faq" className="text-gray-600 hover:text-[#5c3331] transition-colors">FAQ</Link>
          <Link href="/shipping" className="text-gray-600 hover:text-[#5c3331] transition-colors">Shipping & Delivery</Link>
          <Link href="/returns" className="text-gray-600 hover:text-[#5c3331] transition-colors">Returns Policy</Link>
        </div>

        {/* MY ACCOUNT */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-black text-[#5c3331] uppercase tracking-widest mb-2 text-xs md:text-sm">My Account</h4>
          <Link href="/login" className="text-gray-600 hover:text-[#5c3331] transition-colors">Sign In / Register</Link>
          <Link href="/track-order" className="text-gray-600 hover:text-[#5c3331] transition-colors">Track My Order</Link>
        </div>

        {/* FOLLOW US */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-black text-[#5c3331] uppercase tracking-widest mb-2 text-xs md:text-sm">Follow Us</h4>
          <div className="flex space-x-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#5c3331] hover:bg-[#5c3331] hover:text-white transition-all shadow-sm border border-gray-200">
              IG
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#5c3331] hover:bg-[#5c3331] hover:text-white transition-all shadow-sm border border-gray-200">
              FB
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#5c3331] hover:bg-[#5c3331] hover:text-white transition-all shadow-sm border border-gray-200">
              YT
            </a>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200/50 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LARA Fragrance. All rights reserved.
      </div>
    </footer>
  );
}