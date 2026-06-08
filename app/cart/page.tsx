"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { auth, db } from "@/lib/firebase"; 
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // State Pengiriman
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: ""
  });

  // State Ekspedisi
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email || "customer@example.com");
    }
  }, []);

  const handleInputChange = (e: any) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // Fungsi memanggil API Ongkir Biteship
  const checkOngkir = async () => {
    if (shippingData.postalCode.length < 5) return alert("Masukkan kodepos yang valid (5 digit).");
    setIsFetchingRates(true);

    try {
      const itemsForBiteship = cart.map(item => ({
        name: item.name,
        description: item.name,
        value: item.price,
        weight: 250, // Asumsi berat 1 parfum + packaging = 250 gram
        quantity: item.quantity
      }));

      const response = await fetch("/api/ongkir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_postal_code: shippingData.postalCode,
          items: itemsForBiteship
        })
      });

      const data = await response.json();
      if (data.success && data.pricing.length > 0) {
        setShippingOptions(data.pricing);
      } else {
        alert("Gagal menemukan layanan pengiriman untuk kodepos ini.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengecek ongkir.");
    } finally {
      setIsFetchingRates(false);
    }
  };

  const finalTotal = totalPrice + (selectedShipping ? selectedShipping.price : 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!auth.currentUser) {
      window.location.href = "/login";
      return;
    }
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.postalCode) {
      return alert("Lengkapi data alamat.");
    }
    if (!selectedShipping) {
      return alert("Pilih kurir pengiriman terlebih dahulu.");
    }

    setIsProcessing(true);

    try {
      const orderId = `LARA-${Date.now()}`;

      // Simpan Data Order & Ekspedisi ke Firebase
      const saveToFirebase = setDoc(doc(db, "orders", orderId), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        items: cart,
        totalItemPrice: totalPrice,
        shippingCost: selectedShipping.price,
        totalAmount: finalTotal,
        shippingInfo: shippingData,
        courier: {
          company: selectedShipping.company,
          type: selectedShipping.type,
          courier_service_name: selectedShipping.courier_service_name
        },
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Siapkan payload untuk Midtrans (Total Pembayaran = Harga Barang + Ongkir)
      const orderData = {
        order_id: orderId,
        gross_amount: finalTotal,
        item_details: [
          ...cart.map(item => ({
            id: String(item.id),
            price: item.price,
            quantity: item.quantity,
            name: item.name.substring(0, 50)
          })),
          {
            id: "SHIPPING",
            price: selectedShipping.price,
            quantity: 1,
            name: `Ongkir ${selectedShipping.company} ${selectedShipping.type}`.substring(0, 50)
          }
        ],
        customer_details: {
          first_name: shippingData.fullName,
          email: userEmail,
          phone: shippingData.phone,
        }
      };

      const fetchMidtrans = fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }).then(res => res.json());

      const [_, data] = await Promise.all([saveToFirebase, fetchMidtrans]);

      if (data.token) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: async function (result: any) {
            await updateDoc(doc(db, "orders", orderId), {
              status: "success",
              paymentResult: result
            });
            clearCart();
            window.location.href = "/track-order";
          },
          onPending: function () {
            alert("Menunggu Pembayaran.");
            setIsProcessing(false);
          },
          onError: function () {
            alert("Pembayaran Gagal.");
            setIsProcessing(false);
          },
          onClose: function () {
            setIsProcessing(false);
          }
        });
      } else {
        alert("Gagal memuat pembayaran.");
        setIsProcessing(false);
      }
    } catch (error) {
      alert("Error sistem.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="afterInteractive" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 uppercase text-center md:text-left">Your Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[30px] p-10 text-center shadow-sm">
            <p className="text-gray-900 mb-6">Your bag is empty.</p>
            <Link href="/" className="bg-gray-900 text-white font-bold px-8 py-3 uppercase rounded-xl">Continue Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-6">
              
              {/* ITEM LIST */}
              <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 uppercase border-b pb-4">Items</h2>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded" />
                      <div>
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-900">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-900 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PENGIRIMAN & KURIR */}
              <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 uppercase border-b pb-4">Shipping Info</h2>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="fullName" 
                    value={shippingData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Nama Penerima" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-500 outline-none focus:border-black" 
                  />
                  <input 
                    type="text" 
                    name="phone" 
                    value={shippingData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Nomor WA" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-500 outline-none focus:border-black" 
                  />
                  <textarea 
                    name="address" 
                    value={shippingData.address} 
                    onChange={handleInputChange} 
                    placeholder="Alamat Jalan/Blok/RT/RW" 
                    rows={2} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-500 outline-none focus:border-black resize-none"
                  ></textarea>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="postalCode" 
                      value={shippingData.postalCode} 
                      onChange={handleInputChange} 
                      placeholder="Kode Pos (5 digit)" 
                      maxLength={5} 
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-500 outline-none focus:border-black" 
                    />
                    <button 
                      onClick={checkOngkir} 
                      disabled={isFetchingRates} 
                      className="bg-black text-white px-6 font-bold text-xs uppercase rounded-xl disabled:bg-gray-400 hover:bg-gray-800 transition"
                    >
                      {isFetchingRates ? "Loading..." : "Cek Ongkir"}
                    </button>
                  </div>

                  {shippingOptions.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs font-bold text-black mb-2 uppercase">Pilih Kurir:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {shippingOptions.map((opt, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedShipping(opt)}
                            className={`p-3 border rounded-xl cursor-pointer text-sm flex justify-between items-center text-black ${selectedShipping?.courier_service_name === opt.courier_service_name ? 'border-black bg-gray-100 font-bold' : 'border-gray-200'}`}
                          >
                            <span>{opt.company.toUpperCase()} - {opt.type}</span>
                            <span>Rp {opt.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="w-full lg:w-80 bg-white p-8 rounded-[30px] shadow-sm h-fit sticky top-24">
              <h2 className="text-lg font-extrabold text-gray-900 mb-6 uppercase border-b pb-4">Summary</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-900">Items Total</span>
                <span className="font-bold">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-900">Shipping</span>
                <span className="font-bold">{selectedShipping ? `Rp ${selectedShipping.price.toLocaleString("id-ID")}` : "-"}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4 mb-8">
                <span className="font-bold text-gray-900 uppercase text-xs">Total Pay</span>
                <span className="font-black text-xl">Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>

              <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-gray-900 text-white font-bold py-4 uppercase rounded-2xl disabled:bg-gray-400">
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}