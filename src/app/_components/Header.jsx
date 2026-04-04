"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false); // Cierra el menú en móvil al buscar
    } else {
      router.push(`/catalogo`);
      setIsMobileMenuOpen(false);
    }
  };

  // 🟢 AQUÍ PUEDES AGREGAR O MODIFICAR TUS ENLACES EXACTOS
  const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Catálogo", path: "/catalogo" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white border-b border-[#bec9c2]/30 z-50 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center gap-4">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-black tracking-widest text-[#131b2e] z-50"
        >
          WOOX
        </Link>

        {/* NAVEGACIÓN Y BUSCADOR (PC) */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          <nav className="flex items-center gap-6 text-sm font-bold text-[#3f4944] uppercase tracking-wider">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="hover:text-[#004532] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* BUSCADOR (PC) */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bec9c2]"
              style={{ fontSize: "18px" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f2f3ff] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#004532] transition-all"
            />
          </form>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="md:hidden z-50 text-[#131b2e] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "28px" }}
          >
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* MENÚ DESPLEGABLE (MÓVIL) */}
      <div
        className={`
        fixed inset-0 bg-white z-40 pt-20 px-6 flex flex-col gap-6 md:hidden
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* BUSCADOR (MÓVIL) */}
        <form onSubmit={handleSearch} className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#bec9c2]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#f2f3ff] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#004532] transition-all"
          />
        </form>

        <nav className="flex flex-col gap-4 mt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-tight text-[#131b2e] border-b border-[#bec9c2]/20 pb-4"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
