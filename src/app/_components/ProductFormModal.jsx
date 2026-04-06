"use client";
import { useState, useEffect } from "react";
import { supabase } from "../_lib/supabase/supabase";
import Swal from "sweetalert2";
export default function ProductFormModal({
  isOpen,
  onClose,
  categorias,
  productoAEditar,
  onSaveSuccess,
}) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: 0,
    destacado: false,
    imagen_url: "",
  });
  const [cargando, setCargando] = useState(false);

  // Si nos pasan un producto para editar, llenamos el formulario. Si no, lo vaciamos.
  useEffect(() => {
    if (productoAEditar) {
      setForm({
        nombre: productoAEditar.nombre || "",
        categoria: productoAEditar.categoria || "",
        descripcion: productoAEditar.descripcion || "",
        precio: productoAEditar.precio || 0,
        destacado: productoAEditar.destacado || false,
        imagen_url: productoAEditar.imagen_url || "",
      });
    } else {
      setForm({
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        destacado: false,
        imagen_url: "",
      });
    }
  }, [productoAEditar, isOpen]);

  if (!isOpen) return null;

  const handleGuardar = async (e) => {
    e.preventDefault();
    setCargando(true);

    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      marca: "WOOX",
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio) || 0,
      destacado: Boolean(form.destacado),
      imagen_url: form.imagen_url.trim(),
    };

    try {
      if (productoAEditar) {
        const { data, error } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", productoAEditar.id)
          .select();
        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("Acción bloqueada por RLS.");
        // Para Actualizado
        Swal.fire({
          title: "¡Logrado!",
          text: "El producto ha sido actualizado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#004532",
        });
      } else {
        const { data, error } = await supabase
          .from("productos")
          .insert([payload])
          .select();
        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("Acción bloqueada por RLS.");
        // Para Creado
        Swal.fire({
          title: "¡Producto Creado!",
          text: "El nuevo artículo ya está disponible en el catálogo.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#004532",
        });
      }
      onSaveSuccess(); // Le avisa a la página principal que recargue la tabla
      onClose(); // Cierra el modal
    } catch (error) {
      Swal.fire({
        title: "Ups, algo salió mal",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-emerald-900">
            {productoAEditar ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors font-bold text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleGuardar}
          className="p-6 flex flex-col gap-4 text-sm"
        >
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Nombre del Producto
            </label>
            <input
              type="text"
              placeholder="Ej. Taladro WOOX..."
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
                Categoría
              </label>
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>
                  Selecciona una...
                </option>
                {categorias.map((cat, idx) => (
                  <option key={idx} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              URL de la Imagen
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.imagen_url}
              onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Descripción detallada
            </label>
            <textarea
              placeholder="Especificaciones, usos..."
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all resize-none"
              rows="3"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 p-3 rounded-lg border border-emerald-100 transition-colors mt-1 w-fit">
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

          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition-colors flex-1 shadow-md disabled:bg-emerald-400"
            >
              {cargando
                ? "Guardando..."
                : productoAEditar
                  ? "Guardar Cambios"
                  : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
