import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Shipping</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Shipping & Delivery
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
          <p><strong>Jadwal Pengiriman:</strong></p>
          <p>Pesanan yang dibayar sebelum pukul 15.00 WIB (Senin - Jumat) akan diproses dan dikirim pada hari yang sama. Pesanan di hari Sabtu, Minggu, atau Hari Libur Nasional akan diproses pada hari kerja berikutnya.</p>
          
          <p><strong>Estimasi Waktu Pengiriman:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Jabodetabek: 1-2 hari kerja</li>
            <li>Pulau Jawa: 2-4 hari kerja</li>
            <li>Luar Pulau Jawa: 3-7 hari kerja</li>
          </ul>

          <p><strong>Keamanan Packing:</strong></p>
          <p>Karena produk kami berbahan dasar kaca, kami menggunakan standar <em>bubble wrap</em> tebal berlapis dan kotak kardus ganda tanpa biaya tambahan untuk memastikan barang sampai di tangan Anda dengan selamat.</p>
        </div>
      </div>
    </div>
  );
}