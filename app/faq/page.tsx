import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">FAQ</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            FAQ
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-8">
          
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Berapa lama wangi parfum LARA bertahan?</h3>
            <p>Parfum kami masuk ke dalam kategori <em>Eau de Parfum</em> (EDP). Rata-rata daya tahannya mencapai 6-8 jam di kulit, dan bisa lebih dari 12 jam jika disemprotkan di pakaian, tergantung aktivitas dan suhu tubuh.</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Apakah aman untuk kulit sensitif?</h3>
            <p>Formulasi kami dirancang selembut mungkin. Namun, jika Anda memiliki riwayat alergi yang parah, kami sarankan untuk melakukan <em>patch test</em> (menyemprotkan sedikit di pergelangan tangan bagian dalam) terlebih dahulu.</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Apakah parfum ini meninggalkan noda di baju?</h3>
            <p>Tidak. LARA Fragrance diformulasikan agar tidak meninggalkan noda kuning pada kemeja putih atau pakaian berwarna terang Anda. Pastikan menyemprot dari jarak 15-20 cm.</p>
          </div>

        </div>
      </div>
    </div>
  );
}