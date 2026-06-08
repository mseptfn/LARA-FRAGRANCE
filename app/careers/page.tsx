import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Careers</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Careers
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6 text-center">
          <p className="font-semibold text-lg text-gray-900">
            Jadilah bagian dari revolusi industri wewangian lokal!
          </p>
          <p>
            Saat ini, kami belum memiliki lowongan pekerjaan yang terbuka. Namun, kami selalu mencari talenta-talenta kreatif, mulai dari <em>fragrance evaluator</em>, <em>digital marketing</em>, hingga <em>web developer</em> yang antusias.
          </p>
          <p className="mt-8">
            Kirimkan CV dan portofolio Anda ke: <br/>
            <strong className="text-[#5c3331]">hrd@larafragrance.com</strong>
          </p>
          <p className="text-sm text-gray-500">Kami akan menyimpan data Anda dan menghubungi jika ada posisi yang sesuai.</p>
        </div>
      </div>
    </div>
  );
}