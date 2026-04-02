"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";

export default function ProductosCRUD() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: 0,
    destacado: false,
    imagen_url: "",
  });

  const fetchProductos = useCallback(async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Error al cargar productos:", error);
    } else {
      setProductos(data || []);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    // Limpieza estricta de datos
    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio) || 0,
      destacado: Boolean(form.destacado),
      imagen_url: form.imagen_url.trim(),
    };

    try {
      if (editandoId) {
        const { error } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", editandoId);
        if (error) throw error;
        alert("✅ Producto actualizado correctamente");
      } else {
        const { error } = await supabase.from("productos").insert([payload]);
        if (error) throw error;
        alert("✅ Producto creado correctamente");
      }

      setForm({
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        destacado: false,
        imagen_url: "",
      });
      setEditandoId(null);
      await fetchProductos();
    } catch (error) {
      console.error("Fallo en CRUD de Supabase:", error);
      alert(
        "❌ Error al guardar: " +
          (error.message || "Revisa la consola para más detalles."),
      );
    }
  };

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre || "",
      categoria: producto.categoria || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || 0,
      destacado: producto.destacado || false,
      imagen_url: producto.imagen_url || "",
    });
    setEditandoId(producto.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      await fetchProductos();
      alert("🗑️ Producto eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit lg:sticky lg:top-4 order-1">
        <h2 className="text-lg font-bold mb-5 text-emerald-900 border-b border-emerald-100 pb-3">
          {editandoId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
        </h2>
        <form onSubmit={handleGuardar} className="flex flex-col gap-4 text-sm">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Categoría"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio ($)"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <input
            type="url"
            placeholder="URL de la Imagen"
            value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all"
          />

          <textarea
            placeholder="Descripción detallada..."
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition-all resize-none"
            rows="3"
          />

          <label className="flex items-center gap-3 cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 p-3 rounded-lg border border-emerald-100 transition-colors mt-1">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) =>
                setForm({ ...form, destacado: e.target.checked })
              }
              className="w-5 h-5 text-emerald-700 rounded focus:ring-emerald-600 cursor-pointer"
            />
            <span className="font-bold text-emerald-900">
              Destacar en Inicio
            </span>
          </label>

          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              className="bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition-colors flex-1 shadow-md shadow-emerald-700/20"
            >
              {editandoId ? "Guardar Cambios" : "Crear Producto"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={() => {
                  setEditandoId(null);
                  setForm({
                    nombre: "",
                    categoria: "",
                    descripcion: "",
                    precio: 0,
                    destacado: false,
                    imagen_url: "",
                  });
                }}
                className="bg-slate-100 text-slate-600 font-bold py-3 px-5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA RESPONSIVA */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden order-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Img
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Nombre
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Precio
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                  Destacado
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4">
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        alt="img"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-800 text-sm truncate max-w-[200px]">
                    {p.nombre}
                  </td>
                  <td className="p-4 text-emerald-700 font-semibold text-sm">
                    ${p.precio}
                  </td>
                  <td className="p-4 text-center text-yellow-500 text-lg">
                    {p.destacado ? "★" : ""}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEditar(p)}
                      className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors text-sm mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="text-red-500 font-bold hover:text-red-700 transition-colors text-sm"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
