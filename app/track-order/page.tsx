"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // State untuk Modal Review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        let fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        fetchedOrders.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleOrderReceived = async (orderId: string) => {
    if (confirm("Apakah Anda yakin paket sudah diterima dengan baik?")) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "delivered" });
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: "delivered" } : order));
        toast.success("Terima kasih! Pesanan diselesaikan.");
      } catch (error) {
        toast.error("Gagal memperbarui status.");
      }
    }
  };

  const handleReportCS = (orderId: string) => {
    const waNumber = "62895620496445";
    const message = `Halo LARA CS, saya ingin melaporkan kendala pada pesanan saya dengan Order ID: ${orderId}. Paket saya tak kunjung sampai / ada masalah. Mohon bantuannya.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handlePrintInvoice = (order: any) => {
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head><title>Invoice - ${order.id}</title><style>body{font-family:Arial;padding:40px;color:#333}.header{border-bottom:2px solid #000;padding-bottom:20px;margin-bottom:20px}.total{font-size:20px;font-weight:bold;margin-top:20px;border-top:1px solid #ccc;padding-top:10px}</style></head>
        <body>
          <div class="header"><h1>LARA FRAGRANCE - INVOICE</h1><p>Order ID: ${order.id}</p></div>
          <h3>Ditagihkan Kepada:</h3><p>${order.shippingInfo?.fullName}<br/>${order.shippingInfo?.phone}<br/>${order.shippingInfo?.address}</p>
          <table width="100%" border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;margin-top:20px">
            <tr style="background:#f0f0f0"><th>Produk</th><th>Qty</th><th>Subtotal</th></tr>
            ${order.items.map((item: any) => `<tr><td>${item.name}</td><td align="center">${item.quantity}</td><td align="right">Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</td></tr>`).join('')}
            <tr><td colspan="2" align="right">Ongkos Kirim</td><td align="right">Rp ${order.shippingCost?.toLocaleString("id-ID")}</td></tr>
          </table>
          <div class="total" align="right">TOTAL DIBAYAR: Rp ${order.totalAmount?.toLocaleString("id-ID")}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  };

  // Fungsi Buka Modal Review
  const openReviewModal = (order: any, item: any) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setRating(5);
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  // Fungsi Submit Review ke Firestore
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      // 1. Simpan review ke collection "reviews"
      await addDoc(collection(db, "reviews"), {
        orderId: selectedOrder.id,
        productId: selectedItem.id || selectedItem.name, // Fallback ke name jika id produk tidak tersimpan di cart
        productName: selectedItem.name,
        userId: user.uid,
        userName: user.email?.split('@')[0] || "Anonim",
        rating: rating,
        comment: reviewText,
        createdAt: new Date()
      });

      // 2. Tandai item ini di dalam order bahwa sudah direview agar tombol hilang
      const updatedItems = selectedOrder.items.map((i: any) => 
        i.name === selectedItem.name ? { ...i, isReviewed: true } : i
      );

      await updateDoc(doc(db, "orders", selectedOrder.id), { items: updatedItems });

      // Update UI Lokal
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, items: updatedItems } : o));
      
      toast.success("Ulasan berhasil dikirim!");
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error("Gagal mengirim ulasan.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Menunggu Pembayaran</span>;
      case 'success': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Diproses</span>;
      case 'shipped': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Sedang Dikirim</span>;
      case 'delivered': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Selesai</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-10 pb-20 relative">
      
      {/* MODAL REVIEW */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[30px] shadow-xl w-full max-w-md">
            <h2 className="font-black text-gray-900 mb-2 uppercase tracking-widest text-lg">Beri Ulasan</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">Nilai produk <span className="font-bold text-black">{selectedItem?.name}</span></p>
            
            <form onSubmit={handleSubmitReview}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    onClick={() => setRating(star)}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className={`w-10 h-10 cursor-pointer transition ${rating >= star ? "text-[#b88c3e]" : "text-gray-200"}`}
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              
              <textarea 
                placeholder="Tulis pendapatmu tentang wangi, ketahanan, atau packagingnya..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-4 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200 resize-none h-28 mb-6"
                required
              />
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="w-1/2 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200">Batal</button>
                <button type="submit" disabled={isSubmittingReview} className="w-1/2 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400">
                  {isSubmittingReview ? "Loading..." : "Kirim Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#5c3331] uppercase tracking-tighter mb-8 border-b-2 border-[#5c3331] pb-4">Pesanan Saya</h1>

        {loading ? (
          <p className="text-center font-bold text-gray-500">Memuat data pesanan...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-[30px] shadow-sm">
            <p className="text-gray-500 mb-4">Anda belum memiliki pesanan.</p>
            <Link href="/" className="text-[#5c3331] font-bold hover:underline">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-pink-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Order ID: {order.id}</p>
                    <p className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                    {order.trackingNumber && (
                      <div className="mt-2 bg-gray-50 border border-gray-200 p-2 rounded-lg inline-block">
                        <p className="text-[9px] uppercase font-bold text-gray-400 mb-0.5">No. Resi ({order.courier?.company})</p>
                        <p className="text-xs font-mono font-black text-gray-800">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="mb-6">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-50 py-3 gap-2">
                      <div className="text-sm text-gray-700">
                        <span>{item.quantity}x {item.name}</span>
                        <p className="font-medium mt-1">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                      </div>
                      
                      {/* TOMBOL REVIEW: Muncul per item jika status delivered dan belum direview */}
                      {order.status === 'delivered' && !item.isReviewed && (
                        <button 
                          onClick={() => openReviewModal(order, item)}
                          className="bg-white border border-[#b88c3e] text-[#b88c3e] px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#b88c3e] hover:text-white transition w-max"
                        >
                          Beri Ulasan
                        </button>
                      )}
                      {order.status === 'delivered' && item.isReviewed && (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">✓ Sudah Diulas</span>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center text-sm text-gray-700 pt-2 mt-2">
                    <span>Ongkir ({order.courier?.company})</span>
                    <span className="font-medium">Rp {order.shippingCost?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                    <span>Total Tagihan</span>
                    <span>Rp {order.totalAmount?.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                  {order.status !== 'pending' && (
                    <button onClick={() => handleReportCS(order.id)} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition">
                      Lapor CS
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button onClick={() => handleOrderReceived(order.id)} className="bg-[#004236] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#002b23] transition ml-auto">
                      Pesanan Diterima
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button onClick={() => handlePrintInvoice(order)} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition ml-auto">
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}