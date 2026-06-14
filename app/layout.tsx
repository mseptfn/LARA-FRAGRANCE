import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LARA Fragrance',
  description: 'Premium Local Fragrance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          {children}
          
          {/* 2. Tambahkan Toaster di sini dengan tema khusus LARA */}
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #fce7f3', // Warna border pink-100 khas LARA
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#004236', // Hijau gelap LARA
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#b51c1c', // Merah gelap LARA
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}