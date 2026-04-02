"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
        router.push("/portal");
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/portal");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-emerald-900 font-bold">
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
    <div className="bg-slate-50 flex flex-col md:flex-row h-screen overflow-hidden text-slate-800">
      {/* SIDEBAR RESPONSIVO - VERDE PINO */}
      <aside className="w-full md:w-64 bg-emerald-900 text-white flex flex-col shadow-xl z-20 flex-shrink-0 order-2 md:order-1">
        <div className="hidden md:flex h-16 items-center px-6 border-b border-emerald-800 bg-emerald-950">
          <h2 className="text-2xl font-black tracking-widest text-white">
            WOOX
          </h2>
        </div>

        <nav className="flex-none md:flex-1 p-2 md:py-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-none">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md"
                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                }`}
              >
                <span className="text-xl md:text-base">{link.icon}</span>
                <span className="text-xs md:text-base">{link.name}</span>
              </Link>
            );
          })}

          <Link
            href="/"
            target="_blank"
            className="hidden md:flex mt-auto items-center gap-3 px-4 py-3 rounded-lg font-bold text-emerald-200 hover:bg-emerald-800 transition-all border border-emerald-700/50"
          >
            <span>🌐</span> Ver Sitio Público
          </Link>
        </nav>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden order-1 md:order-2">
        {/* HEADER RESPONSIVO */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm z-10 flex-shrink-0">
          <h1 className="text-base md:text-lg font-bold text-emerald-900 truncate">
            {navLinks.find((l) => l.href === pathname)?.name || "Panel"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm font-medium text-slate-600">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 px-4 py-2 rounded-lg"
            >
              Salir
            </button>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100/50">
          {children}
        </main>
      </div>
    </div>
  );
}
