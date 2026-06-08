"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase"; // Import database
import { collection, getDocs, query, where } from "firebase/firestore"; // Import fungsi spesifik

const ProductSkeleton = () => (
  <div className="flex flex-col bg-white p-2 shadow-sm rounded-sm">
    <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse mb-3"></div>
    <div className="h-4 bg-gray-100 animate-pulse mb-2 rounded w-3/4"></div>
    <div className="h-3 bg-gray-100 animate-pulse mb-3 rounded w-1/2"></div>
    <div className="h-10 bg-gray-100 animate-pulse rounded w-full mt-auto"></div>
  </div>
);

export default function CategoryPage() {
  const params = useParams();
  // Menangkap slug dari URL (face, body, fragrance)
  const categorySlug = typeof params?.category === "string" ? params.category.toLowerCase() : "";
  const title = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true); 
    setActiveTab("All");

    const fetchCategoryProducts = async () => {
      try {
        // Query spesifik ke Firestore: Ambil jika "category" sama dengan categorySlug
        const q = query(
          collection(db, "products"), 
          where("category", "==", categorySlug)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]); 

  const filteredProducts = products.filter((product) => {
    if (activeTab === "All") return true;
    return product.gender === activeTab;
  });

  return (
    <div className="min-h-screen bg-pink-50">
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2 uppercase tracking-wide">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{title}</span>
        </nav>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tightest uppercase">
            {title}
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-4xl leading-relaxed">
            Discover the best {title.toLowerCase()} care products. Tailored for your unique needs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-1 border-t border-b border-gray-200/60 mb-8 gap-4 md:gap-0">
          <span className="text-sm text-gray-600 font-semibold tracking-wide">
            {loading ? "..." : filteredProducts.length} PRODUCTS
          </span>

          <div className="flex space-x-2 md:space-x-3">
            {["All", "Women", "Gentlemen"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs md:text-sm font-bold px-4 md:px-6 py-2 border transition duration-300 uppercase tracking-widest ${
                  activeTab === tab
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
                }`}
              >
                {tab === "All" ? "View All" : `For ${tab}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
          {loading ? (
            Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col relative bg-white transition hover:shadow-lg p-2 rounded-sm shadow-sm border border-gray-100">
                
                {product.label && (
                  <div className={`absolute top-4 left-4 text-white text-[10px] md:text-xs font-bold px-3 py-1 z-10 tracking-widest ${product.label === 'NEW' ? 'bg-green-700' : 'bg-[#b88c3e]'}`}>
                    {product.label}
                  </div>
                )}
                
                <div className="relative w-full aspect-[4/5] bg-[#f7f7f7] mb-4 flex items-center justify-center p-3 md:p-5">
                  <img src={product.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                </div>
                
                <div className="flex flex-col flex-grow px-2">
                  <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-medium min-h-[16px]">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-gray-900 text-[13px] md:text-sm leading-snug mb-2 line-clamp-2 min-h-[38px]">{product.name}</h3>
                  
                  <div className="mt-auto pt-3">
                    <p className="font-bold text-gray-900 text-sm md:text-base mb-5">Rp {product.price?.toLocaleString("id-ID")}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full border border-gray-900 bg-white text-gray-900 text-xs md:text-sm font-bold py-3 uppercase tracking-widest transition duration-300 group-hover:bg-gray-900 group-hover:text-white"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">No products found for this category yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}