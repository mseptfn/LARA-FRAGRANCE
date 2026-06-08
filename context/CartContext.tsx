"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  // TAMBAHKAN TIPE INI
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Gagal membaca keranjang");
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product: any) => {
    if (!currentUser) {
      alert("Oops! Anda harus Sign In dan memverifikasi email untuk memasukkan barang ke keranjang.");
      router.push("/login");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => String(item.id) === String(product.id));
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          String(item.id) === String(product.id) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        updatedCart = [...prevCart, { 
          id: String(product.id), 
          name: product.name, 
          price: Number(product.price), 
          image: product.image, 
          quantity: 1 
        }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    alert(`${product.name} berhasil ditambahkan!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => String(item.id) !== String(id));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // BUAT FUNGSI CLEAR CART DI SINI
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  return (
    // TAMBAHKAN clearCart DI DALAM VALUE PROVIDER
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider");
  return context;
};