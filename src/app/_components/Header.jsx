"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supabase/supabase";
import ProductDetailModal from "./ProductDetailModal";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // 🟢 ESTADOS PARA BÚSQUEDA EN VIVO
  const [sugerencias, setSugerencias] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🟢 ESTADOS PARA EL MODAL DESDE EL HEADER
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 REFERENCIA PARA EL ABORTCONTROLLER (El truco de Jonas)
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const term = searchTerm.trim();

    // Si borra todo, limpiamos inmediatamente
    if (term.length === 0) {
      setSugerencias([]);
      setShowDropdown(false);
      setIsSearching(false);
      // Cancelamos cualquier búsqueda en progreso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    const fetchData = async () => {
      // 1. Si hay una petición anterior corriendo, la MATAMOS.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. Creamos un nuevo controlador para esta nueva letra
      abortControllerRef.current = new AbortController();

      try {
        const { data, error } = await supabase
          .from("productos")
          .select("id, nombre, precio, imagen_url, categoria")
          .ilike("nombre", `%${term}%`)
          .limit(5)
          .abortSignal(abortControllerRef.current.signal); // Le pasamos la señal a Supabase

        // Si la petición no fue abortada y no hubo error, actualizamos la lista
        if (!error) {
          setSugerencias(data || []);
        }
      } catch (error) {
        // Ignoramos los errores que sean específicamente porque nosotros abortamos la petición
        if (error.name !== "AbortError") {
          console.error("Error en la búsqueda:", error);
        }
      } finally {
        setIsSearching(false);
      }
    };

    // Mantenemos el Debounce cortito (150ms) combinado con el AbortController
    const timer = setTimeout(fetchData, 150);

    // Función de limpieza del useEffect
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
      setIsMobileMenuOpen(false);
    }
  };

  const abrirModalProducto = async (id) => {
    setShowDropdown(false);
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setProductoSeleccionado(data);
      setIsModalOpen(true);
    }
  };

  const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Catálogo", path: "/catalogo" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full bg-white border-b border-[#bec9c2]/30 z-40 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-widest text-[#131b2e] z-50"
          >
            WOOX
          </Link>

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

            {/* BUSCADOR CON DROPDOWN (PC) */}
            <div className="relative w-full max-w-xs">
              <form onSubmit={handleSearchSubmit}>
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
                  onFocus={() => {
                    if (searchTerm.trim().length >= 1) setShowDropdown(true); // 🟢 Ahora reacciona desde 1 letra
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f2f3ff] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#004532] transition-all"
                />
              </form>

              {/* CUADRO DE SUGERENCIAS */}
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#bec9c2]/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {isSearching ? (
                    <div className="p-4 text-center flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#004532] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-[#3f4944] font-bold uppercase tracking-widest">
                        Buscando...
                      </span>
                    </div>
                  ) : sugerencias.length > 0 ? (
                    <ul>
                      {sugerencias.map((prod) => (
                        <li key={prod.id}>
                          <button
                            onClick={() => abrirModalProducto(prod.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-[#f2f3ff] transition-colors text-left border-b border-[#bec9c2]/10 last:border-0"
                          >
                            <img
                              src={
                                prod.imagen_url ||
                                "https://via.placeholder.com/50"
                              }
                              alt={prod.nombre}
                              className="w-10 h-10 rounded-md object-cover bg-slate-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#131b2e] truncate">
                                {prod.nombre}
                              </p>
                              <p className="text-xs text-[#004532] font-black">
                                ${Number(prod.precio).toLocaleString()}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full p-3 text-xs font-bold text-center text-[#3f4944] hover:text-[#004532] hover:bg-[#f2f3ff] uppercase tracking-widest transition-colors"
                        >
                          Ver todos los resultados →
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <span
                        className="material-symbols-outlined text-[#bec9c2] mb-2"
                        style={{ fontSize: "32px" }}
                      >
                        search_off
                      </span>
                      <p className="text-sm text-[#131b2e] font-bold">
                        No hay coincidencias
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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

        {/* MENÚ MÓVIL */}
        <div
          className={`fixed inset-0 bg-white z-30 pt-20 px-6 flex flex-col gap-6 md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <form onSubmit={handleSearchSubmit} className="relative w-full">
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

      {/* RENDERIZAMOS EL MODAL AQUÍ */}
      <ProductDetailModal
        producto={productoSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
