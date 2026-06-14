"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("fragrance");
  const [gender, setGender] = useState("Women");
  const [image, setImage] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<"products" | "orders" | "reports">("products");

  // State untuk Edit Produk
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin/login");
    }
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
    setOrders(data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        category,
        image, 
        gender,
        createdAt: new Date()
      });

      toast.success("Produk Berhasil Ditambah!");
      setName(""); setPrice(""); setImage("");
      fetchProducts();
    } catch (error) {
      toast.error("Gagal menambah produk.");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        category: editingProduct.category,
        image: editingProduct.image,
        gender: editingProduct.gender,
      });

      toast.success("Produk Berhasil Diperbarui!");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error("Gagal memperbarui produk.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleAutoShip = async (order: any) => {
    if (!confirm(`Request pickup kurir ${order.courier?.company} untuk pesanan ini?`)) return;
    try {
      const courierName = order.courier?.company?.toLowerCase() || "";
      let prefix = "LARA"; 
      if (courierName.includes("jne")) prefix = "JT";
      else if (courierName.includes("sicepat")) prefix = "00";
      else if (courierName.includes("j&t") || courierName.includes("jnt")) prefix = "JP";
      else if (courierName.includes("grab")) prefix = "GE";

      const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000);
      const autoResi = `${prefix}${randomNumbers}`;

      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { status: "shipped", trackingNumber: autoResi });
      toast.success(`Resi dibuat otomatis: ${autoResi}`);
      fetchOrders(); 
    } catch (error) {
      toast.error("Gagal memproses pengiriman otomatis.");
    }
  };

  const reportData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== "pending");
    let totalOmset = 0; let totalProdukTerjual = 0;
    const itemSales: any = {}; const dateSales: any = {};

    validOrders.forEach(order => {
      totalOmset += (order.totalAmount || 0);
      const dateStr = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }) : "Unknown";
      if(!dateSales[dateStr]) dateSales[dateStr] = { date: dateStr, orderCount: 0, revenue: 0 };
      dateSales[dateStr].orderCount += 1;
      dateSales[dateStr].revenue += (order.totalAmount || 0);

      order.items?.forEach((item: any) => {
        totalProdukTerjual += item.quantity;
        if(!itemSales[item.name]) itemSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
        itemSales[item.name].qty += item.quantity;
        itemSales[item.name].revenue += (item.price * item.quantity);
      });
    });

    return {
      totalOmset, totalProdukTerjual, totalOrders: validOrders.length,
      itemSalesArray: Object.values(itemSales).sort((a: any, b: any) => b.qty - a.qty),
      dateSalesArray: Object.values(dateSales).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-pink-50 p-6 md:p-12 relative">
      
      {/* MODAL EDIT PRODUK */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Edit Produk</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" placeholder="Nama Produk" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200" required />
              <input type="number" placeholder="Harga" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200" required />
              <input type="text" placeholder="URL Gambar (Link)" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200" required />
              
              <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200">
                <option value="fragrance">Fragrance</option>
                <option value="body">Body</option>
                <option value="bundling">Bundling</option>
              </select>

              <select value={editingProduct.gender} onChange={(e) => setEditingProduct({...editingProduct, gender: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200">
                <option value="Women">For Women</option>
                <option value="Gentlemen">For Gentlemen</option>
                <option value="Unisex">Unisex</option>
              </select>

              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setEditingProduct(null)} className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-300">Batal</button>
                <button type="submit" className="w-1/2 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Control Panel</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button onClick={() => setActiveSection("products")} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition ${activeSection === "products" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}>Kelola Produk</button>
            <button onClick={() => setActiveSection("orders")} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition relative ${activeSection === "orders" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              Kelola Pesanan
              {orders.filter(o => o.status === "success").length > 0 && <span className="absolute -top-1 -right-1 bg-red-660 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">{orders.filter(o => o.status === "success").length}</span>}
            </button>
            <button onClick={() => setActiveSection("reports")} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition ${activeSection === "reports" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}>Laporan Penjualan</button>
            <button onClick={() => { sessionStorage.clear(); router.push("/admin/login"); }} className="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline ml-2">Logout</button>
          </div>
        </div>

        {activeSection === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-[30px] shadow-sm border border-pink-100 h-fit">
              <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Tambah Produk Baru</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-xl outline-none text-sm border border-gray-200" required />
                <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-xl outline-none text-sm border border-gray-200" required />
                <input type="text" placeholder="URL Gambar (Link)" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-3 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-xl outline-none text-sm border border-gray-200" required />
                
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200">
                  <option value="fragrance">Fragrance</option>
                  <option value="body">Body</option>
                  <option value="bundling">Bundling</option>
                </select>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl outline-none text-sm border border-gray-200">
                  <option value="Women">For Women</option>
                  <option value="Gentlemen">For Gentlemen</option>
                  <option value="Unisex">Unisex</option>
                </select>
                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black mt-4 shadow-lg">Simpan Produk</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-[30px] shadow-sm border border-pink-100">
              <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Daftar Produk di Web</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Gambar</th>
                      <th className="py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Produk</th>
                      <th className="py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Harga</th>
                      <th className="py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-2">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover bg-gray-50 rounded-lg" />
                        </td>
                        <td className="py-4 font-bold text-gray-900">{p.name}</td>
                        <td className="py-4 text-gray-700 font-medium">Rp {p.price?.toLocaleString("id-ID")}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => setEditingProduct(p)} className="text-blue-600 font-bold mr-4 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === "orders" && (
          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-pink-100">
            <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Daftar Pesanan Masuk</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-wider">
                    <th className="py-4 font-bold">Order ID & Penerima</th>
                    <th className="py-4 font-bold">Items</th>
                    <th className="py-4 font-bold">Total & Kurir</th>
                    <th className="py-4 font-bold">Status</th>
                    <th className="py-4 font-bold text-right">Aksi Ekspedisi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-4 vertical-align-top">
                        <p className="font-bold text-gray-900 text-xs">{order.id}</p>
                        <p className="text-gray-700 font-semibold mt-1">{order.shippingInfo?.fullName}</p>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed max-w-[200px]">{order.shippingInfo?.address}, {order.shippingInfo?.postalCode} <br/>WA: {order.shippingInfo?.phone}</p>
                      </td>
                      <td className="py-4 pr-4 text-xs text-gray-700 font-medium">
                        <ul className="list-disc pl-4 space-y-0.5">{order.items?.map((item: any, i: number) => <li key={i}>{item.quantity}x {item.name}</li>)}</ul>
                      </td>
                      <td className="py-4 pr-4 text-xs text-gray-800">
                        <p className="font-bold text-gray-900">Rp {order.totalAmount?.toLocaleString()}</p>
                        <p className="text-gray-500 uppercase mt-1 font-bold">{order.courier?.company} ({order.courier?.type})</p>
                      </td>
                      <td className="py-4 pr-4">
                        {order.status === "pending" && <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending</span>}
                        {order.status === "success" && <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Diproses</span>}
                        {order.status === "shipped" && <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Dikirim</span>}
                        {order.status === "delivered" && <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Selesai</span>}
                        {order.trackingNumber && <p className="text-[10px] text-gray-400 mt-1 font-mono font-bold">Resi: {order.trackingNumber}</p>}
                      </td>
                      <td className="py-4 text-right">
                        {order.status === "success" ? <button onClick={() => handleAutoShip(order)} className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-800 transition whitespace-nowrap">Request Pickup & Resi</button> : order.status === "pending" ? <span className="text-[11px] text-gray-400 italic">Menunggu pembayaran</span> : <span className="text-[11px] text-gray-400 italic">Pickup Selesai</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "reports" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[30px] shadow-sm border border-pink-100 flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Omset Kasar</p>
                <h3 className="text-3xl font-black text-gray-900">Rp {reportData.totalOmset.toLocaleString("id-ID")}</h3>
              </div>
              <div className="bg-white p-6 rounded-[30px] shadow-sm border border-pink-100 flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Pesanan Lunas</p>
                <h3 className="text-3xl font-black text-gray-900">{reportData.totalOrders} <span className="text-lg text-gray-400 font-medium">Transaksi</span></h3>
              </div>
              <div className="bg-white p-6 rounded-[30px] shadow-sm border border-pink-100 flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Produk Terjual</p>
                <h3 className="text-3xl font-black text-gray-900">{reportData.totalProdukTerjual} <span className="text-lg text-gray-400 font-medium">Items</span></h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[30px] shadow-sm border border-pink-100">
                <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Penjualan Berdasarkan Tanggal</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-wider">
                        <th className="py-4 font-bold">Tanggal</th>
                        <th className="py-4 font-bold text-center">Jml Transaksi</th>
                        <th className="py-4 font-bold text-right">Total Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dateSalesArray.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-bold text-gray-900">{row.date}</td>
                          <td className="py-4 text-center text-gray-700">{row.orderCount}</td>
                          <td className="py-4 text-right font-bold text-green-700">Rp {row.revenue.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[30px] shadow-sm border border-pink-100">
                <h2 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-widest">Penjualan Berdasarkan Produk</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-wider">
                        <th className="py-4 font-bold">Nama Produk</th>
                        <th className="py-4 font-bold text-center">Terjual</th>
                        <th className="py-4 font-bold text-right">Total Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.itemSalesArray.map((item: any, i: number) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-bold text-gray-900">{item.name}</td>
                          <td className="py-4 text-center text-gray-700">{item.qty} pcs</td>
                          <td className="py-4 text-right font-bold text-green-700">Rp {item.revenue.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}