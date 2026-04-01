"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";

export default function ProductosCRUD() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    nombre: "", categoria: "", descripcion: "", precio: 0, destacado: false, imagen_url: "",
  });

  const fetchProductos = useCallback(async () => {
    const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: false });
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
    
    // 1. Limpieza estricta de datos antes de enviar a Supabase
    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio) || 0, // Forzamos a que sea un número real
      destacado: Boolean(form.destacado),
      imagen_url: form.imagen_url.trim()
    };

    try {
      if (editandoId) {
        console.log("Actualizando ID:", editandoId, "con payload:", payload);
        const { error } = await supabase.from("productos").update(payload).eq("id", editandoId);
        if (error) throw error;
        alert("✅ Producto actualizado correctamente");
      } else {
        console.log("Creando nuevo producto con payload:", payload);
        const { error } = await supabase.from("productos").insert([payload]);
        if (error) throw error;
        alert("✅ Producto creado correctamente");
      }

      setForm({ nombre: "", categoria: "", descripcion: "", precio: 0, destacado: false, imagen_url: "" });
      setEditandoId(null);
      await fetchProductos();
      
    } catch (error) {
      console.error("Fallo en CRUD de Supabase:", error);
      alert("❌ Error al guardar: " + (error.message || "Revisa la consola (F12) para más detalles."));
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
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-fit lg:sticky lg:top-4 order-1">
        <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">
          {editandoId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
        </h2>
        <form onSubmit={handleGuardar} className="flex flex-col gap-4 text-sm">
          {/* ... Inputs iguales, pero simplificados para móvil ... */}
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <input type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <input type="url" placeholder="URL de Imagen" value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="3" />
          
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded border">
            <input type="checkbox" checked={form.destacado} onChange={e => setForm({...form, destacado: e.target.checked})} className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-700">Destacar en Inicio</span>
          </label>
          
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2.5 rounded hover:bg-blue-700 transition flex-1">
              {editandoId ? "Guardar" : "Crear"}
            </button>
            {editandoId && (
              <button type="button" onClick={() => { setEditandoId(null); setForm({nombre:"", categoria:"", descripcion:"", precio:0, destacado:false, imagen_url:""}); }} className="bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded hover:bg-slate-300 transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA RESPONSIVA */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden order-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 font-bold text-slate-600 text-sm">Img</th>
                <th className="p-3 font-bold text-slate-600 text-sm">Nombre</th>
                <th className="p-3 font-bold text-slate-600 text-sm">Precio</th>
                <th className="p-3 font-bold text-slate-600 text-sm text-center">Destacado</th>
                <th className="p-3 font-bold text-slate-600 text-sm text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-3">
                    {p.imagen_url && <img src={p.imagen_url} alt="img" className="w-10 h-10 object-cover rounded shadow-sm" />}
                  </td>
                  <td className="p-3 font-medium text-slate-800 text-sm truncate max-w-[150px]">{p.nombre}</td>
                  <td className="p-3 text-slate-600 text-sm">${p.precio}</td>
                  <td className="p-3 text-center text-yellow-500">{p.destacado ? "★" : ""}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleEditar(p)} className="text-blue-600 font-bold hover:underline text-sm mr-3">Editar</button>
                    <button onClick={() => handleEliminar(p.id)} className="text-red-600 font-bold hover:underline text-sm">Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
