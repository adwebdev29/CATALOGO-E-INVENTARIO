"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";

export default function ConfiguracionPage() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

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
        .insert([{ nombre: nombreLimpio }])
        .select();
      if (error) {
        if (error.code === "23505")
          throw new Error("Esta categoría ya existe.");
        throw error;
      }
      if (!data || data.length === 0)
        throw new Error("Bloqueado por Supabase RLS.");

      setNuevaCategoria("");
      await fetchCategorias();
      alert("✅ Categoría agregada");
    } catch (error) {
      alert("❌ Error: " + error.message);
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
      const { data, error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Bloqueado por Supabase RLS.");

      await fetchCategorias();
    } catch (error) {
      alert("❌ Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* FORMULARIO DE CATEGORÍAS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold mb-5 text-emerald-900 border-b border-emerald-100 pb-3">
          ⚙️ Configurar Categorías
        </h2>

        <form
          onSubmit={handleAgregarCategoria}
          className="flex flex-col gap-4 text-sm"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cat_nombre"
              className="font-bold text-slate-600 text-xs uppercase tracking-wider"
            >
              Nombre de la nueva categoría
            </label>
            <input
              id="cat_nombre"
              type="text"
              placeholder="Ej. Consumibles, Refacciones..."
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-700/20"
          >
            Agregar Categoría
          </button>
        </form>
      </div>

      {/* LISTADO DE CATEGORÍAS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-emerald-900">
          Categorías Actuales
        </h3>
        <ul className="divide-y divide-slate-100">
          {categorias.map((cat) => (
            <li key={cat.id} className="py-3 flex justify-between items-center">
              <span className="font-medium text-slate-700">{cat.nombre}</span>
              <button
                onClick={() => handleEliminarCategoria(cat.id)}
                className="text-red-500 font-bold text-sm hover:text-red-700 bg-red-50 px-3 py-1 rounded-md transition-colors"
              >
                Eliminar
              </button>
            </li>
          ))}
          {categorias.length === 0 && (
            <p className="text-slate-400 text-sm py-4">
              No hay categorías registradas.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
