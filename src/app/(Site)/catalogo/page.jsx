"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/app/_components/ProductCard";

function CatalogoContenido() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🟢 ESTADOS DE DATOS
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 FILTROS (Inicializamos la búsqueda con lo que venga en la URL)
  const queryInicial = searchParams.get("q") || "";
  const [busqueda, setBusqueda] = useState(queryInicial);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [marcaActiva, setMarcaActiva] = useState("Todas");

  // 🟢 UI / PAGINACIÓN
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Sincronizar estado local de búsqueda si la URL cambia (ej: desde el Header)
  useEffect(() => {
    setBusqueda(searchParams.get("q") || "");
  }, [searchParams]);

  // Manejar búsqueda local (actualiza la URL limpiamente)
  const handleBusquedaLocal = (e) => {
    const val = e.target.value;
    setBusqueda(val);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`/catalogo?${params.toString()}`, { scroll: false });
  };

  // 🟢 FETCH CENTRAL
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (categorias.length === 0) {
        const [resCat, resMar] = await Promise.all([
          supabase.from("categorias").select("nombre").order("nombre"),
          supabase.from("marcas").select("nombre").order("nombre"),
        ]);
        if (!resCat.error) setCategorias(resCat.data || []);
        if (!resMar.error) setMarcas(resMar.data || []);
      }

      let query = supabase.from("productos").select("*", { count: "exact" });

      if (busqueda) query = query.ilike("nombre", `%${busqueda}%`);
      if (categoriaActiva !== "Todos")
        query = query.eq("categoria", categoriaActiva);
      if (marcaActiva !== "Todas") query = query.eq("marca", marcaActiva);

      query = query.order("id", { ascending: false });

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      setProductos(data || []);
      setTotalItems(count || 0);
    } catch (err) {
      console.error("Error cargando catálogo:", err);
    }
    setLoading(false);
  }, [currentPage, busqueda, categoriaActiva, marcaActiva, categorias.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, categoriaActiva, marcaActiva]);

  return (
    <div className="pt-16 flex min-h-screen bg-[#faf8ff] text-[#131b2e] w-full">
      {/* SIDEBAR (Tus estilos originales) */}
      <aside
        className={`fixed lg:sticky top-16 z-40 lg:z-auto w-72 h-[calc(100vh-4rem)] bg-[#f2f3ff] border-r border-[#bec9c2]/10 p-6 overflow-y-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <button
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase mb-4 text-[#3f4944]">
            Categorías
          </h3>
          <button
            onClick={() => setCategoriaActiva("Todos")}
            className={`block w-full text-left p-2 rounded hover:bg-[#dae2fd] ${categoriaActiva === "Todos" ? "font-bold text-[#004532]" : ""}`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => setCategoriaActiva(cat.nombre)}
              className={`block w-full text-left p-2 rounded hover:bg-[#dae2fd] ${categoriaActiva === cat.nombre ? "font-bold text-[#004532]" : ""}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase mb-4 text-[#3f4944]">
            Marcas
          </h3>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="radio"
                checked={marcaActiva === "Todas"}
                onChange={() => setMarcaActiva("Todas")}
                className="accent-[#004532]"
              />{" "}
              Todas
            </label>
            {marcas.map((m) => (
              <label
                key={m.nombre}
                className="cursor-pointer flex items-center gap-2"
              >
                <input
                  type="radio"
                  checked={marcaActiva === m.nombre}
                  onChange={() => setMarcaActiva(m.nombre)}
                  className="accent-[#004532]"
                />{" "}
                {m.nombre}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10 w-full overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            {categoriaActiva}
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden border border-[#bec9c2] px-4 py-2 text-sm font-bold"
          >
            Filtros
          </button>
        </div>

        {/* BUSCADOR LOCAL SINCRONIZADO CON URL */}
        <div className="relative mb-8 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={busqueda}
            onChange={handleBusquedaLocal}
            className="border-2 border-[#bec9c2]/30 p-3 pl-10 w-full rounded-lg focus:outline-none focus:border-[#004532]"
          />
        </div>

        {/* RESULTADOS */}
        {loading ? (
          <p className="text-[#3f4944] font-bold">Cargando catálogo...</p>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-[#3f4944]">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} main={false} />
            ))}
          </div>
        )}

        {/* PAGINACIÓN */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex gap-4 justify-center items-center font-bold">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo(0, 0);
              }}
              className="p-2 border-2 border-[#131b2e] rounded-full disabled:opacity-20"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo(0, 0);
              }}
              className="p-2 border-2 border-[#131b2e] rounded-full disabled:opacity-20"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Envolvemos el catálogo en Suspense por requerimientos de Next.js al usar useSearchParams
export default function Catalogo() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 text-center text-xl font-bold">
          Cargando WOOX...
        </div>
      }
    >
      <CatalogoContenido />
    </Suspense>
  );
}
