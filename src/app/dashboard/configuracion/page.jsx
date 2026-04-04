"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import { Star, StarOff, Trash2, PlusCircle, LayoutGrid } from "lucide-react"; // 🟢 Usamos Lucide

export default function ConfiguracionPage() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [isPopularNueva, setIsPopularNueva] = useState(false); // Estado para el checkbox al crear
  const [loadingIds, setLoadingIds] = useState([]); // Para mostrar estado de carga por categoría

  const fetchCategorias = useCallback(async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre", { ascending: true });
    if (!error) setCategorias(data || []);
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleAgregarCategoria = async (e) => {
    e.preventDefault();
    const nombreLimpio = nuevaCategoria.trim();
    if (!nombreLimpio) return;

    try {
      const { data, error } = await supabase
        .from("categorias")
        .insert([{ nombre: nombreLimpio, popular: isPopularNueva }]) // 🟢 Guardamos el estado popular
        .select();

      if (error) {
        if (error.code === "23505")
          throw new Error("Esta categoría ya existe.");
        throw error;
      }
      if (!data || data.length === 0)
        throw new Error("Bloqueado por Supabase RLS.");

      setNuevaCategoria("");
      setIsPopularNueva(false);
      await fetchCategorias();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  // 🟢 NUEVA FUNCIÓN: Alternar estado Popular
  const togglePopular = async (id, estadoActual) => {
    setLoadingIds((prev) => [...prev, id]); // Activamos loader para este ID
    try {
      const { error } = await supabase
        .from("categorias")
        .update({ popular: !estadoActual })
        .eq("id", id);

      if (error) throw error;

      // Actualizamos el estado local sin hacer fetch de nuevo (más rápido)
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, popular: !estadoActual } : cat,
        ),
      );
    } catch (error) {
      alert("❌ Error al actualizar estado popular: " + error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id)); // Quitamos loader
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar esta categoría? Si hay productos usándola, podrían quedarse sin categoría visible.",
      )
    )
      return;
    try {
      const { error } = await supabase.from("categorias").delete().eq("id", id);

      if (error) throw error;

      await fetchCategorias();
    } catch (error) {
      alert("❌ Error al eliminar: " + error.message);
    }
  };

  // Contamos cuántas categorías populares hay
  const popularesCount = categorias.filter((c) => c.popular).length;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ── FORMULARIO DE CATEGORÍAS ── */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-[#bec9c2]/30 h-fit">
        <h2 className="text-xl font-black mb-5 text-[#131b2e] border-b border-[#bec9c2]/20 pb-3 flex items-center gap-2">
          <LayoutGrid size={24} className="text-[#004532]" />
          Nueva Categoría
        </h2>

        <form
          onSubmit={handleAgregarCategoria}
          className="flex flex-col gap-6 text-sm"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="cat_nombre"
              className="font-bold text-[#3f4944] text-[10px] uppercase tracking-widest"
            >
              Nombre de la categoría
            </label>
            <input
              id="cat_nombre"
              type="text"
              placeholder="Ej. Lubricantes, Medidores..."
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-3 rounded-lg focus:ring-2 focus:ring-[#004532] focus:outline-none transition-all"
              required
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group bg-[#f8faf9] p-3 rounded-lg border border-[#bec9c2]/20">
            <input
              type="checkbox"
              checked={isPopularNueva}
              onChange={(e) => setIsPopularNueva(e.target.checked)}
              className="w-4 h-4 accent-[#004532] cursor-pointer"
            />
            <div>
              <span className="font-bold text-[#131b2e] text-sm block group-hover:text-[#004532] transition-colors">
                Destacar en Inicio (Popular)
              </span>
              <span className="text-[10px] text-[#3f4944]">
                Aparecerá en las tarjetas de la página principal.
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={!nuevaCategoria.trim()}
            className="bg-[#004532] text-white font-bold py-3.5 rounded-lg hover:bg-[#065f46] transition-colors shadow-md flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle size={16} />
            Agregar Categoría
          </button>
        </form>
      </div>

      {/* ── LISTADO DE CATEGORÍAS ── */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-[#bec9c2]/30">
        <div className="flex justify-between items-end mb-4 border-b border-[#bec9c2]/20 pb-3">
          <h3 className="text-xl font-black text-[#131b2e]">
            Gestión de Categorías
          </h3>
          <span className="text-xs font-bold text-[#004532] bg-[#e6f4ed] px-3 py-1 rounded-full">
            {popularesCount} Populares
          </span>
        </div>

        <p className="text-xs text-[#3f4944] mb-4">
          Haz clic en la{" "}
          <Star
            size={12}
            className="inline text-yellow-500 fill-yellow-500 mx-1"
          />{" "}
          para mostrar u ocultar la categoría en la página de inicio.
        </p>

        <ul className="divide-y divide-[#bec9c2]/10">
          {categorias.map((cat) => {
            const isLoading = loadingIds.includes(cat.id);
            return (
              <li
                key={cat.id}
                className="py-4 flex justify-between items-center group"
              >
                <div className="flex items-center gap-3">
                  {/* 🟢 BOTÓN DE ESTRELLA (TOGGLE POPULAR) */}
                  <button
                    onClick={() => togglePopular(cat.id, cat.popular)}
                    disabled={isLoading}
                    title={
                      cat.popular ? "Quitar de Inicio" : "Destacar en Inicio"
                    }
                    className={`p-2 rounded-full transition-all ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {cat.popular ? (
                      <Star
                        size={22}
                        className="text-yellow-500 fill-yellow-500 drop-shadow-sm"
                      />
                    ) : (
                      <StarOff
                        size={22}
                        className="text-slate-300 hover:text-yellow-400"
                      />
                    )}
                  </button>

                  <div>
                    <span className="font-bold text-[#131b2e] text-sm uppercase tracking-wider block">
                      {cat.nombre}
                    </span>
                    <span className="text-[10px] text-[#3f4944]">
                      {cat.popular ? "Visible en Inicio" : "Oculta en Inicio"}
                    </span>
                  </div>
                </div>

                {/* BOTÓN ELIMINAR */}
                <button
                  onClick={() => handleEliminarCategoria(cat.id)}
                  className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Eliminar Categoría"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
          {categorias.length === 0 && (
            <div className="text-center py-10">
              <LayoutGrid size={48} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">
                No hay categorías registradas.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Crea tu primera categoría a la izquierda.
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
