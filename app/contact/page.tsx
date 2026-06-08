import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Contact Us</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Contact Us
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hubungi Kami</h3>
            <p className="mb-4">Punya pertanyaan tentang produk, pesanan, atau kolaborasi? Tim kami siap membantu Anda.</p>
            <p><strong>Email:</strong> support@larafragrance.com</p>
            <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
            <p><strong>Jam Operasional:</strong><br/>Senin - Jumat: 09.00 - 17.00 WIB</p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Lokasi Kantor</h3>
            <p>Tangerang Selatan, Banten<br/>Indonesia</p>
          </div>

          <form className="flex flex-col space-y-4">
            <input type="text" placeholder="Nama Lengkap" className="p-3 border border-gray-200 rounded outline-none focus:border-[#5c3331]" />
            <input type="email" placeholder="Email Address" className="p-3 border border-gray-200 rounded outline-none focus:border-[#5c3331]" />
            <textarea placeholder="Pesan Anda" rows={5} className="p-3 border border-gray-200 rounded outline-none focus:border-[#5c3331]"></textarea>
            <button type="button" className="bg-[#5c3331] text-white py-3 px-6 font-bold uppercase tracking-widest hover:bg-[#3a201f] transition">Kirim Pesan</button>
          </form>
        </div>
      </div>
    </div>
  );
}