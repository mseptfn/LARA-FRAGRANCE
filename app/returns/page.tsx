import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Returns</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Returns Policy
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
          <p>Kepuasan pelanggan adalah prioritas utama kami. Kami menerima pengembalian dana atau penukaran barang dengan syarat berikut:</p>
          
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Barang Pecah/Bocor:</strong> Wajib menyertakan <em>Video Unboxing</em> (tanpa jeda/edit) dari awal paket masih tersegel rapat hingga menunjukkan letak kerusakan. Klaim maksimal 2x24 jam setelah barang berstatus "Diterima".</li>
            <li><strong>Salah Kirim Varian:</strong> Jika varian yang Anda terima tidak sesuai dengan pesanan, mohon jangan membuka segel plastik botol. Segera hubungi CS kami dengan melampirkan foto produk dan nomor pesanan.</li>
          </ul>

          <p><em>*Mohon maaf, kami tidak menerima retur barang dengan alasan tidak cocok dengan aromanya (masalah selera). Kami sarankan untuk membeli ukuran "Discovery Set / Tester" terlebih dahulu.</em></p>
        </div>
      </div>
    </div>
  );
}