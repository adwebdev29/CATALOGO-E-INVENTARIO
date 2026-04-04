import "../globals.css";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import CartDrawer from "../_components/CartDrawer";
import WhatsAppFloat from "../_components/WhatsAppFloat";
import { CartProvider } from "../_context/CartContext";

export const metadata = {
  title: "WOOX | Catálogo y Herramientas",
  description: "Equipos de precisión y herramientas arquitectónicas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-[#131b2e] bg-[#faf8ff]">
        <CartProvider>
          <Header />
          <CartDrawer />
          <WhatsAppFloat />
          <div className="min-h-screen flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
