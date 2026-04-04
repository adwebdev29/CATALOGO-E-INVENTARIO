import { supabase } from "@/app/_lib/supabase/supabase";
import ProductCard from "@/app/_components/ProductCard";
import CatalogoLayout from "@/app/_components/CatalogoLayout"; // 🟢 Importamos el Layout
import Link from "next/link";
import { ArrowLeft, ArrowRight, PackageX } from "lucide-react";

export const revalidate = 0;
const ITEMS_PER_PAGE = 12;

export default async function Catalogo(props) {
  const searchParams = await props.searchParams;

  const busqueda = searchParams?.q || "";
  const categoriaActiva = searchParams?.categoria || "Todos";
  const marcaActiva = searchParams?.marca || "Todas";
  const currentPage = parseInt(searchParams?.pagina || "1", 10);

  const [resCat, resMar] = await Promise.all([
    supabase.from("categorias").select("nombre").order("nombre"),
    supabase.from("marcas").select("nombre").order("nombre"),
  ]);

  const categorias = resCat.data || [];
  const marcas = resMar.data || [];

  let query = supabase.from("productos").select("*", { count: "exact" });

  if (busqueda) query = query.ilike("nombre", `%${busqueda}%`);
  if (categoriaActiva !== "Todos")
    query = query.eq("categoria", categoriaActiva);
  if (marcaActiva !== "Todas") query = query.eq("marca", marcaActiva);

  query = query.order("id", { ascending: false });

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const {
    data: productos,
    count: totalItems,
    error,
  } = await query.range(from, to);

  if (error) {
    console.error("Error cargando catálogo desde el servidor:", error);
  }

  const totalPages = Math.ceil((totalItems || 0) / ITEMS_PER_PAGE);

  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === "string") {
          params.set(key, value);
        }
      });
    }
    params.set("pagina", pageNumber.toString());
    return `/catalogo?${params.toString()}`;
  };

  return (
    <CatalogoLayout categorias={categorias} marcas={marcas}>
      {/* ── RESULTADOS (Grid Inyectado) ── */}
      {!productos || productos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageX size={64} strokeWidth={1} className="text-[#bec9c2] mb-4" />
          <p className="text-2xl font-black text-[#131b2e] tracking-tight">
            No se encontraron productos
          </p>
          <p className="text-[#3f4944] mt-2 text-sm max-w-sm">
            Intenta con otros términos o limpia los filtros de búsqueda.
          </p>
          <Link
            href="/catalogo"
            className="mt-6 bg-[#004532] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#131b2e] transition-colors"
          >
            Limpiar Filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} main={false} />
          ))}
        </div>
      )}

      {/* ── PAGINACIÓN ── */}
      {totalPages > 1 && (
        <div className="mt-12 flex gap-4 justify-center items-center font-bold">
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="p-2 border-2 border-[#131b2e] rounded-full text-[#131b2e] hover:bg-[#131b2e] hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
          ) : (
            <button
              disabled
              className="p-2 border-2 border-[#131b2e] rounded-full opacity-20 cursor-not-allowed"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <span>
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="p-2 border-2 border-[#131b2e] rounded-full text-[#131b2e] hover:bg-[#131b2e] hover:text-white transition-colors"
            >
              <ArrowRight size={20} />
            </Link>
          ) : (
            <button
              disabled
              className="p-2 border-2 border-[#131b2e] rounded-full opacity-20 cursor-not-allowed"
            >
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      )}
    </CatalogoLayout>
  );
}
