import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-pink-50/30 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Our Story</span>
        </nav>

        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Our Story
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        {/* Isi Konten Halaman */}
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
          <p className="font-semibold text-lg text-gray-900 text-center mb-8">
            "Berawal dari mimpi untuk menghadirkan aroma mewah internasional dengan sentuhan kekayaan alam lokal."
          </p>
          
          <p>
            LARA Fragrance lahir dari sebuah garasi kecil di Tangerang Selatan. Kami menyadari bahwa banyak orang Indonesia yang menginginkan parfum berkualitas tinggi, tahan lama, dan memiliki karakter aroma layaknya brand desainer Eropa, namun dengan harga yang tetap bersahabat.
          </p>

          <p>
            Kami menghabiskan waktu lebih dari 2 tahun bekerjasama dengan *perfumer* lokal dan internasional untuk meracik formula yang sempurna. Setiap tetes LARA Fragrance dibuat menggunakan bahan-bahan pilihan yang diekstrak secara etis, memadukan aroma floral klasik dengan sentuhan modern yang disesuaikan dengan iklim tropis Indonesia.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Misi Kami</h3>
          <p>
            Kami percaya bahwa wewangian bukan sekadar pelengkap penampilan, melainkan identitas dan pembangun kepercayaan diri. Misi kami adalah menemani setiap langkah dan momen berharga Anda melalui aroma yang tak terlupakan.
          </p>
        </div>

      </div>
    </div>
  );
}