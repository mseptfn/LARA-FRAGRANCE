import Link from "next/link";

export default function IngredientsPage() {
  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
          <Link href="/" className="hover:text-[#5c3331] transition">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5c3331]">Ingredients</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#5c3331] uppercase tracking-tighter mb-4">
            Our Ingredients
          </h1>
          <div className="w-16 h-1 bg-[#5c3331] mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
          <p>
            Di LARA Fragrance, kami percaya bahwa kualitas aroma berawal dari kualitas bahan bakunya. Kami secara transparan memilih bahan-bahan terbaik dari seluruh dunia, memadukan kekayaan alam dengan inovasi sains modern.
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Essential Oils Premium:</strong> Kami menggunakan minyak atsiri murni yang diekstrak dengan metode <em>cold-press</em> untuk menjaga keaslian aroma.</li>
            <li><strong>Vegan & Cruelty-Free:</strong> 100% bahan kami tidak mengandung unsur hewani dan tidak pernah diuji coba pada hewan.</li>
            <li><strong>Safe Synthetics:</strong> Untuk melindungi alam dari eksploitasi berlebih (seperti musk asli), kami menggunakan bahan sintetis aman yang tersertifikasi IFRA (International Fragrance Association).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}