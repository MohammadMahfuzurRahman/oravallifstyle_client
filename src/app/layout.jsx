import './globals.css';
import CartProvider from '@/components/CartProvider';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  title: 'Oravel Lifestyle — Premium Accessories, Lamps & Mirrors',
  description: 'Curated accessories, elegant lamps and statement mirrors. Cash on Delivery across Bangladesh.',
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <CartDrawer />
        </CartProvider>
        <footer className="footer">
          <div className="container">
            <strong>Oravel Lifestyle</strong>
            <p className="muted small">Cash on Delivery · Free shipping over ৳5,000 · © {new Date().getFullYear()} Oravel Lifestyle</p>
          </div>
        </footer>
        <WhatsAppButton />
      </body>
    </html>
  );
}
