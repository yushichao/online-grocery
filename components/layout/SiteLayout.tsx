import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductProvider } from "@/context/ProductContext";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </ProductProvider>
  );
}
