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
    if (!error) setProductos(data || []);
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // FIX: Aseguramos que se envíe el form exacto y capturamos errores
        const { error } = await supabase
          .from("productos")
          .update({
            nombre: form.nombre,
            categoria: form.categoria,
            descripcion: form.descripcion,
            precio: form.precio,
            destacado: form.destacado,
            imagen_url: form.imagen_url,
          })
          .eq("id", editandoId);

        if (error) throw error;
        alert("¡Producto actualizado correctamente!");
      } else {
        const { error } = await supabase.from("productos").insert([form]);
        if (error) throw error;
        alert("¡Producto creado correctamente!");
      }

      // Limpieza total del estado
      setForm({
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        destacado: false,
        imagen_url: "",
      });
      setEditandoId(null);

      // Forzar recarga de la tabla
      await fetchProductos();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || 0,
      destacado: producto.destacado || false,
      imagen_url: producto.imagen_url || "",
    });
    setEditandoId(producto.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Sube la pantalla al form
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (!error) {
      fetchProductos();
    } else {
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">
          {editandoId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
        </h2>
        <form onSubmit={handleGuardar} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block text-slate-500 font-bold mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">
                Precio
              </label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: parseFloat(e.target.value) || 0 })
                }
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">
              URL de Imagen
            </label>
            <input
              type="text"
              value={form.imagen_url}
              onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3 rounded-lg border">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) =>
                setForm({ ...form, destacado: e.target.checked })
              }
              className="w-5 h-5 text-blue-600"
            />
            <span className="font-bold text-slate-700">Destacar en Inicio</span>
          </label>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex-1"
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
                className="bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-bold text-slate-600">Img</th>
                <th className="p-4 font-bold text-slate-600">Nombre</th>
                <th className="p-4 font-bold text-slate-600">Precio</th>
                <th className="p-4 font-bold text-slate-600 text-center">
                  Destacado
                </th>
                <th className="p-4 font-bold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    {p.imagen_url && (
                      <img
                        src={p.imagen_url}
                        alt={p.nombre}
                        className="w-12 h-12 object-cover rounded-md border shadow-sm"
                      />
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-800">{p.nombre}</td>
                  <td className="p-4 text-slate-600">${p.precio}</td>
                  <td className="p-4 text-center text-yellow-500 text-lg">
                    {p.destacado ? "★" : ""}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditar(p)}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No hay productos.
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
