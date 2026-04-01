"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
      } else {
        // Obtenemos el correo del usuario logueado
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-black">
        Cargando interfaz...
      </div>
    );

  const navLinks = [
    { name: "Inicio", href: "/dashboard", icon: "🏠" },
    { name: "Productos", href: "/dashboard/productos", icon: "🛍️" },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: "👥" },
    { name: "Configuración", href: "/dashboard/configuracion", icon: "⚙️" },
  ];

  return (
    <html lang="es">
      <body className="bg-slate-100 flex h-screen overflow-hidden text-slate-800">
        {/* SIDEBAR (Estilo Factix) */}
        <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-[#0f172a]">
            <h2 className="text-2xl font-black tracking-widest text-white">
              WOOX
            </h2>
          </div>
          <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* HEADER */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm z-10">
            <h1 className="text-lg font-semibold text-slate-700">
              {navLinks.find((l) => l.href === pathname)?.name || "Panel"}
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-slate-600">
                Hola, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </header>

          {/* ÁREA DE CONTENIDO DINÁMICO */}
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
