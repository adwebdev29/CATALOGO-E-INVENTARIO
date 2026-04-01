import "@/app/globals.css";

export const metadata = {
  title: "WOOX | Acceso al Portal",
  description: "Panel de administración WOOX",
};

export default function PortalLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
