import "../globals.css";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import CartDrawer from "../_components/CartDrawer";
import WhatsAppFloat from "../_components/WhatsAppFloat";
import { CartProvider } from "../_context/CartContext";
// 🟢 Importamos el componente de animaciones
import ScrollReveal from "../_components/ScrollReveal";

export const metadata = {
  title: {
    default: "WOOX México | Electrónica y Accesorios para Celular y PC",
    template: "%s | WOOX",
  },
  description:
    "Tu tienda de confianza para cables, adaptadores, cargadores y los mejores accesorios para tus dispositivos móviles y computadoras. Calidad y tecnología a tu alcance.",
  keywords: [
    "accesorios para celular",
    "cargadores",
    "cables usb",
    "adaptadores pc",
    "electrónica méxico",
    "woox store",
    "tecnología",
  ],
  openGraph: {
    title: "WOOX México | Tecnología en tus manos",
    description:
      "Cargadores, adaptadores y accesorios de alta calidad para celular y computadora.",
    url: "https://woox-store.vercel.app",
    siteName: "WOOX México",
    images: [
      {
        url: "https://rurbeszsrsahjotyjojn.supabase.co/storage/v1/object/public/productos/WOOX-AUDIFONOS-HERO.webp",
        width: 1200,
        height: 630,
        alt: "WOOX Accesorios Electrónicos",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* 🟢 Etiqueta para que Google reconozca que eres el dueño del sitio. 
            El código lo obtienes en Google Search Console. */}
        <meta
          name="google-site-verification"
          content="google0cad459420c11b0b"
        />

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
