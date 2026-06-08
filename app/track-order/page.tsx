"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TrackOrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 1. Cek User Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Tarik Data Pesanan dari Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        let fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Urutkan pesanan terbaru di atas
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

  // 3. Fungsi Ubah Status jadi "Selesai / Diterima"
  const handleOrderReceived = async (orderId: string) => {
    if (confirm("Apakah Anda yakin paket sudah diterima dengan baik?")) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "delivered" });
        
        // Update state lokal agar UI langsung berubah tanpa refresh
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: "delivered" } : order
        ));
        
        alert("Terima kasih! Pesanan diselesaikan. Invoice sekarang dapat diunduh.");
      } catch (error) {
        alert("Gagal memperbarui status.");
      }
    }
  };

  // 4. Fungsi Lapor CS (Arahkan ke WhatsApp)
  const handleReportCS = (orderId: string) => {
    const waNumber = "62895620496445"; // Ganti dengan nomor WA bisnis LARA
    const message = `Halo LARA CS, saya ingin melaporkan kendala pada pesanan saya dengan Order ID: ${orderId}. Paket saya tak kunjung sampai / ada masalah. Mohon bantuannya.`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // 5. Cetak Invoice Sederhana (Print UI)
  const handlePrintInvoice = (order: any) => {
    // Membuka tab baru yang hanya berisi teks invoice untuk di-print (PDF)
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LARA FRAGRANCE - INVOICE</h1>
            <p>Order ID: ${order.id}</p>
            <p>Tanggal Pembayaran: ${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString("id-ID") : '-'}</p>
          </div>
          <h3>Ditagihkan Kepada:</h3>
          <p>${order.shippingInfo?.fullName}<br/>
             ${order.shippingInfo?.phone}<br/>
             ${order.shippingInfo?.address}, ${order.shippingInfo?.postalCode}
          </p>
          <table width="100%" border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-top: 20px;">
            <tr style="background: #f0f0f0;"><th>Produk</th><th>Qty</th><th>Subtotal</th></tr>
            ${order.items.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td align="center">${item.quantity}</td>
                <td align="right">Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2" align="right">Ongkos Kirim (${order.courier?.company})</td>
              <td align="right">Rp ${order.shippingCost?.toLocaleString("id-ID")}</td>
            </tr>
          </table>
          <div class="total" align="right">
            TOTAL DIBAYAR: Rp ${order.totalAmount?.toLocaleString("id-ID")}
          </div>
          <p style="margin-top: 50px; text-align: center; color: #888;">Terima kasih telah berbelanja di LARA Fragrance.</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow?.document.close();
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
    <div className="min-h-screen bg-pink-50 pt-10 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#5c3331] uppercase tracking-tighter mb-8 border-b-2 border-[#5c3331] pb-4">
          Pesanan Saya
        </h1>

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
                    <p className="text-xs text-gray-400">
                      {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="mb-6">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm mb-2 text-gray-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm text-gray-700 border-t border-gray-50 pt-2 mt-2">
                    <span>Ongkir ({order.courier?.company})</span>
                    <span className="font-medium">Rp {order.shippingCost?.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                    <span>Total Tagihan</span>
                    <span>Rp {order.totalAmount?.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* AREA TOMBOL AKSI */}
                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                  {/* Tombol Lapor CS - Selalu muncul jika pesanan sudah dibayar (bukan pending) */}
                  {order.status !== 'pending' && (
                    <button 
                      onClick={() => handleReportCS(order.id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition"
                    >
                      Lapor CS
                    </button>
                  )}

                  {/* Tombol Terima Pesanan - Idealnya muncul saat status 'shipped', tapi ini dimunculkan di 'success' juga untuk keperluan testing bypass */}
                  {(order.status === 'success' || order.status === 'shipped') && (
                    <button 
                      onClick={() => handleOrderReceived(order.id)}
                      className="bg-[#004236] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#002b23] transition ml-auto"
                    >
                      Pesanan Diterima
                    </button>
                  )}

                  {/* Tombol Cetak Invoice - HANYA muncul jika pesanan sudah selesai (delivered) */}
                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => handlePrintInvoice(order)}
                      className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition ml-auto"
                    >
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