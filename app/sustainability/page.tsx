import Link from "next/link";

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Sustainability</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Sustainability Commitments
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
          <p>
            Bumi adalah satu-satunya rumah kita. LARA Fragrance berkomitmen untuk mengurangi jejak karbon dan menjaga kelestarian lingkungan dalam setiap botol yang kami produksi.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Janji Kami:</h3>
          <p><strong>1. Kemasan Ramah Lingkungan:</strong> Botol kaca kami terbuat dari 40% kaca daur ulang, dan kotak kemasan kami menggunakan kertas bersertifikat FSC yang mudah didaur ulang.</p>
          <p><strong>2. Program Pengembalian Botol:</strong> Kembalikan 5 botol kosong LARA Fragrance ke toko mitra kami dan dapatkan diskon 15% untuk pembelian berikutnya.</p>
          <p><strong>3. Etika Pengadaan:</strong> Kami bekerja sama dengan petani lokal untuk memastikan mereka mendapatkan upah yang adil dan mempraktikkan pertanian berkelanjutan.</p>
        </div>
      </div>
    </div>
  );
}