"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // === PROSES SIGN IN ===
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 1. Cek apakah email sudah diverifikasi
        if (!user.emailVerified) {
          // Jika belum, keluarkan (logout) secara paksa agar tidak mendapat akses
          await signOut(auth);
          throw new Error("Email belum diverifikasi. Silakan cek kotak masuk atau folder spam Anda untuk link verifikasi.");
        }

        // 2. Jika sudah terverifikasi, lanjutkan Radar Admin
        const adminRef = collection(db, "admins");
        const q = query(adminRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          sessionStorage.setItem("isAdmin", "true");
          toast.success("Selamat datang kembali, Kanjeng");
          router.push("/admin/dashboard");
        } else {
          toast.success("Berhasil Sign In!");
          router.push("/");
        }

      } else {
        // === PROSES REGISTER ===
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Kirim Email Verifikasi
        await sendEmailVerification(user);
        
        // Logout langsung setelah register agar tidak otomatis masuk
        await signOut(auth);

        toast("Registrasi berhasil! Kami telah mengirimkan link verifikasi ke email Anda. Harap verifikasi sebelum Sign In.");
        setIsLogin(true); 
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-sm border border-gray-100 rounded-[30px]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Welcome back to Lara Fragrance." : "Join us for exclusive offers and more."}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent rounded-xl sm:text-sm transition-colors font-medium"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent rounded-xl sm:text-sm transition-colors font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:bg-gray-400 shadow-lg shadow-gray-200"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Register here." 
                : "Already have an account? Sign in."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}