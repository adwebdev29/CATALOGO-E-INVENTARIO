import "../globals.css";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import CartDrawer from "../_components/CartDrawer";
import WhatsAppFloat from "../_components/WhatsAppFloat";
import { CartProvider } from "../_context/CartContext";
// 🟢 Importamos el componente de animaciones
import ScrollReveal from "../_components/ScrollReveal";

export const metadata = {
  title: "Woox México",
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

          {/* 🟢 Animamos el Footer para que aparezca desde abajo en TODAS las páginas */}
          <ScrollReveal direction="up" delay={0.1}>
            <Footer />
          </ScrollReveal>
        </CartProvider>
      </body>
    </html>
  );
}
