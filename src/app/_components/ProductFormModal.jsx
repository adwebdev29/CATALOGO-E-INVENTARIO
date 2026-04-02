"use client";
import { useState, useEffect } from "react";
import { supabase } from "../_lib/supabase/supabase";
import imageCompression from "browser-image-compression";
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
    stock: 0,
    destacado: false,
    imagen_url: "",
  });

  const [cargando, setCargando] = useState(false);

  // ESTADOS PARA EL MANEJO DE IMÁGENES
  const [usarUrl, setUsarUrl] = useState(false);
  const [archivoImagen, setArchivoImagen] = useState(null);

  useEffect(() => {
    if (productoAEditar) {
      setForm({
        nombre: productoAEditar.nombre || "",
        categoria: productoAEditar.categoria || "",
        descripcion: productoAEditar.descripcion || "",
        precio: productoAEditar.precio ?? 0,
        stock: productoAEditar.stock ?? 0,
        destacado: productoAEditar.destacado || false,
        imagen_url: productoAEditar.imagen_url || "",
      });
      // Si ya tiene una URL, activamos el switch de URL
      setUsarUrl(!!productoAEditar.imagen_url);
      setArchivoImagen(null);
    } else {
      setForm({
        nombre: "",
        categoria: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        destacado: false,
        imagen_url: "",
      });
      setUsarUrl(false);
      setArchivoImagen(null);
    }
  }, [productoAEditar, isOpen]);

  if (!isOpen) return null;

  const handleGuardar = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      let finalImageUrl = form.imagen_url || "";

      // 🟢 1. SI ESTÁ EN MODO ARCHIVO Y SELECCIONÓ UNO, LO COMPRIMIMOS Y SUBIMOS
      if (!usarUrl && archivoImagen) {
        // A. Configurar la compresión
        const opcionesCompresion = {
          maxSizeMB: 0.5, // Peso máximo de medio mega
          maxWidthOrHeight: 1200, // Resolución ideal para web
          useWebWorker: true,
          fileType: "image/webp", // Formato ultra ligero
        };

        // B. Comprimir el archivo
        let archivoParaSubir = archivoImagen;
        try {
          archivoParaSubir = await imageCompression(
            archivoImagen,
            opcionesCompresion,
          );
          console.log(
            `✅ Imagen comprimida de ${(archivoImagen.size / 1024 / 1024).toFixed(2)} MB a ${(archivoParaSubir.size / 1024 / 1024).toFixed(2)} MB`,
          );
        } catch (error) {
          console.warn(
            "⚠️ No se pudo comprimir la imagen, subiendo original...",
            error,
          );
        }

        // C. Generar nombre único y subir a Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("productos")
          .upload(fileName, archivoParaSubir, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/webp", // Le decimos a Supabase el formato exacto
          });

        if (uploadError)
          throw new Error("Error al subir la imagen: " + uploadError.message);

        // D. Obtener la URL pública del archivo recién subido
        const { data: publicUrlData } = supabase.storage
          .from("productos")
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // 🟢 2. PREPARAMOS EL PAQUETE DE DATOS PARA LA BASE DE DATOS
      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        marca: "WOOX",
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        destacado: Boolean(form.destacado),
        imagen_url: finalImageUrl,
      };

      // 🟢 3. INSERTAR O ACTUALIZAR SEGÚN CORRESPONDA
      if (productoAEditar) {
        const { data, error } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", productoAEditar.id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("Acción bloqueada por políticas de seguridad (RLS).");
      } else {
        const { data, error } = await supabase
          .from("productos")
          .insert([payload])
          .select();

        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("Acción bloqueada por políticas de seguridad (RLS).");
      }

      // 🟢 4. ÉXITO: CERRAR Y REFRESCAR
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Fallo al guardar:", error);
      alert("❌ " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
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

        <form
          onSubmit={handleGuardar}
          className="p-6 flex flex-col gap-4 text-sm"
        >
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Nombre del Producto
            </label>
            {/* 🛡️ ESCUDO: || "" */}
            <input
              type="text"
              placeholder="Ej. Taladro WOOX..."
              value={form.nombre || ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
                Categoría
              </label>
              {/* 🛡️ ESCUDO: || "" */}
              <select
                value={form.categoria || ""}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>
                  Seleccionar...
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
              {/* 🛡️ ESCUDO: ?? "" */}
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.precio ?? ""}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
                Stock (Cant.)
              </label>
              {/* 🛡️ ESCUDO: ?? "" */}
              <input
                type="number"
                placeholder="0"
                value={form.stock ?? ""}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* 🟢 ZONA HÍBRIDA DE IMAGEN (Subida o URL) */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg mt-2">
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Imagen del Producto
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!usarUrl}
                  onChange={(e) => setUsarUrl(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-500">
                  Usar URL externa
                </span>
              </label>
            </div>

            {usarUrl ? (
              <input
                key="file-input"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.imagen_url || ""}
                onChange={(e) =>
                  setForm({ ...form, imagen_url: e.target.value })
                }
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all bg-white"
                required
              />
            ) : (
              <input
                key="url-input"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setArchivoImagen(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer bg-white border border-slate-300 rounded-lg p-2"
                required={
                  !productoAEditar || (productoAEditar && !form.imagen_url)
                }
              />
            )}
            {!usarUrl && form.imagen_url && productoAEditar && (
              <p className="text-xs text-slate-400 italic">
                Ya hay una imagen guardada. Sube una nueva para reemplazarla.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Descripción detallada
            </label>
            {/* 🛡️ ESCUDO: || "" */}
            <textarea
              placeholder="Especificaciones, usos..."
              value={form.descripcion || ""}
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
              checked={!!form.destacado}
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
