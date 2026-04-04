"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X, Filter } from "lucide-react";

export default function CatalogoLayout({ categorias, marcas, children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🟢 SOURCE OF TRUTH = URL
  const busqueda = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "Todos";
  const marca = searchParams.get("marca") || "Todas";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🟢 ACTUALIZAR URL
  const actualizarFiltros = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "Todos" && value !== "Todas") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset paginación futura
    params.delete("pagina");

    router.replace(`/catalogo?${params.toString()}`, {
      scroll: false,
    });
  };

  // 🟢 BUSCADOR (DEBOUNCE SIN STATE)
  const handleBusquedaLocal = (e) => {
    const val = e.target.value;

    clearTimeout(window.searchTimeout);

    window.searchTimeout = setTimeout(() => {
      actualizarFiltros("q", val);
    }, 400);
  };

  return (
    <div className="pt-16 flex min-h-screen bg-[#faf8ff] text-[#131b2e] w-full">
      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed lg:sticky top-16 z-40 lg:z-auto w-72 h-[calc(100vh-4rem)] bg-[#f2f3ff] border-r border-[#bec9c2]/10 p-6 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          className="lg:hidden absolute top-4 right-4 text-[#131b2e] bg-white p-1.5 rounded-full shadow-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* CATEGORÍAS */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase mb-4 text-[#3f4944] tracking-widest border-b border-[#bec9c2]/20 pb-2">
            Categorías
          </h3>

          <div className="space-y-1">
            <button
              onClick={() => {
                actualizarFiltros("categoria", "Todos");
                setSidebarOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                categoria === "Todos"
                  ? "bg-[#004532] text-white font-bold shadow-md"
                  : "text-[#3f4944] hover:bg-[#e2e7ff] hover:text-[#131b2e] font-medium"
              }`}
            >
              Todos
            </button>

            {categorias.map((cat) => (
              <button
                key={cat.nombre}
                onClick={() => {
                  actualizarFiltros("categoria", cat.nombre);
                  setSidebarOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  categoria === cat.nombre
                    ? "bg-[#004532] text-white font-bold shadow-md"
                    : "text-[#3f4944] hover:bg-[#e2e7ff] hover:text-[#131b2e] font-medium"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* MARCAS */}
        <div>
          <h3 className="text-xs font-bold uppercase mb-4 text-[#3f4944] tracking-widest border-b border-[#bec9c2]/20 pb-2">
            Marcas
          </h3>

          <div className="flex flex-col gap-3">
            <label className="cursor-pointer flex items-center gap-3 text-sm font-medium">
              <input
                type="radio"
                checked={marca === "Todas"}
                onChange={() => actualizarFiltros("marca", "Todas")}
                className="w-4 h-4 accent-[#004532]"
              />
              Todas
            </label>

            {marcas.map((m) => (
              <label
                key={m.nombre}
                className="cursor-pointer flex items-center gap-3 text-sm font-medium"
              >
                <input
                  type="radio"
                  checked={marca === m.nombre}
                  onChange={() => actualizarFiltros("marca", m.nombre)}
                  className="w-4 h-4 accent-[#004532]"
                />
                {m.nombre}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#131b2e]/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN ── */}
      <main className="flex-1 p-6 md:p-10 w-full overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            {categoria}
          </h1>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 border-2 border-[#131b2e] px-4 py-2 text-sm font-bold rounded-lg hover:bg-[#131b2e] hover:text-white"
          >
            <Filter size={16} /> Filtros
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-8 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={busqueda}
            onChange={handleBusquedaLocal}
            className="border-2 border-[#bec9c2]/30 p-3 pl-10 w-full rounded-lg focus:outline-none focus:border-[#004532]"
          />
        </div>

        {/* CONTENIDO (SERVER) */}
        {children}
      </main>
    </div>
  );
}
