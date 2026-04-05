"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 ESTADO INICIAL DEL FORMULARIO INCLUYENDO VARIANTES
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    marca: "",
    imagen_url: "",
    destacado: false,
    stock: 0,
    // Variante 1 (Principal)
    etiqueta_1: "1 Pieza",
    precio: "",
    // Variante 2
    etiqueta_2: "",
    precio_2: "",
    // Variante 3
    etiqueta_3: "",
    precio_3: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [resProd, resCat, resMar] = await Promise.all([
      supabase.from("productos").select("*").order("id", { ascending: false }),
      supabase.from("categorias").select("nombre").order("nombre"),
      supabase.from("marcas").select("nombre").order("nombre"),
    ]);

    if (resProd.data) setProductos(resProd.data);
    if (resCat.data) setCategorias(resCat.data);
    if (resMar.data) setMarcas(resMar.data);
  };

  const openModal = (producto = null) => {
    if (producto) {
      setEditingId(producto.id);
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        categoria: producto.categoria || "",
        marca: producto.marca || "",
        imagen_url: producto.imagen_url || "",
        destacado: producto.destacado || false,
        stock: producto.stock || 0,
        etiqueta_1: producto.etiqueta_1 || "1 Pieza",
        precio: producto.precio || "",
        etiqueta_2: producto.etiqueta_2 || "",
        precio_2: producto.precio_2 || "",
        etiqueta_3: producto.etiqueta_3 || "",
        precio_3: producto.precio_3 || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        categoria: categorias[0]?.nombre || "",
        marca: marcas[0]?.nombre || "",
        imagen_url: "",
        destacado: false,
        stock: 0,
        etiqueta_1: "1 Pieza",
        precio: "",
        etiqueta_2: "",
        precio_2: "",
        etiqueta_3: "",
        precio_3: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Formatear numéricos (Si están vacíos los pasamos como null a Supabase)
    const payload = {
      ...formData,
      precio: formData.precio ? parseFloat(formData.precio) : 0,
      precio_2: formData.precio_2 ? parseFloat(formData.precio_2) : null,
      precio_3: formData.precio_3 ? parseFloat(formData.precio_3) : null,
      stock: parseInt(formData.stock) || 0,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("productos").insert([payload]);
        if (error) throw error;
      }
      await fetchData();
      closeModal();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#bec9c2]/30 pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] flex items-center gap-2">
            <Package className="text-[#004532]" /> Catálogo de Productos
          </h1>
          <p className="text-sm text-[#3f4944] mt-1">
            Gestiona tu inventario y precios por volumen.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#004532] text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#131b2e] transition-colors"
        >
          <Plus size={16} /> Agregar Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-xl shadow-sm border border-[#bec9c2]/30 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f2f3ff] text-[#3f4944] uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="p-4 rounded-tl-xl">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio Base</th>
              <th className="p-4">Variantes</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center rounded-tr-xl">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bec9c2]/20">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-[#bec9c2]/20 shrink-0">
                    {p.imagen_url ? (
                      <img
                        src={p.imagen_url}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-full h-full p-2 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#131b2e]">{p.nombre}</p>
                    {p.destacado && (
                      <span className="text-[9px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        Destacado
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-[#3f4944]">{p.categoria}</td>
                <td className="p-4 font-bold text-[#004532]">
                  ${Number(p.precio).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-[#004532]"
                      title="Nivel 1 configurado"
                    ></span>
                    {p.precio_2 && (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        title="Nivel 2 configurado"
                      ></span>
                    )}
                    {p.precio_3 && (
                      <span
                        className="w-2 h-2 rounded-full bg-teal-400"
                        title="Nivel 3 configurado"
                      ></span>
                    )}
                  </div>
                </td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openModal(p)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE FORMULARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Cabecera Modal */}
            <div className="flex justify-between items-center p-6 border-b border-[#bec9c2]/30 bg-[#f8faf9] rounded-t-2xl">
              <h2 className="text-xl font-black text-[#131b2e]">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario (Scrollable) */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-8"
            >
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#004532] text-xs uppercase tracking-widest flex items-center gap-2 border-b border-[#bec9c2]/20 pb-2">
                  <Tag size={16} /> Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-2.5 rounded-lg focus:ring-2 focus:ring-[#004532] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider mb-1">
                      URL Imagen
                    </label>
                    <input
                      type="url"
                      value={formData.imagen_url}
                      onChange={(e) =>
                        setFormData({ ...formData, imagen_url: e.target.value })
                      }
                      className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-2.5 rounded-lg focus:ring-2 focus:ring-[#004532] outline-none text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider mb-1">
                      Categoría
                    </label>
                    <select
                      required
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                      className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-2.5 rounded-lg focus:ring-2 focus:ring-[#004532] outline-none text-sm"
                    >
                      <option value="">Selecciona...</option>
                      {categorias.map((c) => (
                        <option key={c.nombre} value={c.nombre}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider mb-1">
                      Marca
                    </label>
                    <select
                      value={formData.marca}
                      onChange={(e) =>
                        setFormData({ ...formData, marca: e.target.value })
                      }
                      className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-2.5 rounded-lg focus:ring-2 focus:ring-[#004532] outline-none text-sm"
                    >
                      <option value="">Ninguna</option>
                      {marcas.map((m) => (
                        <option key={m.nombre} value={m.nombre}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3f4944] uppercase tracking-wider mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full bg-[#f2f3ff] border border-[#bec9c2]/30 p-2.5 rounded-lg focus:ring-2 focus:ring-[#004532] outline-none text-sm resize-none"
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#131b2e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destacado: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#004532]"
                    />
                    ⭐ Destacar en Inicio
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider">
                      Stock:
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-20 bg-[#f2f3ff] border border-[#bec9c2]/30 p-1.5 rounded-md focus:ring-2 focus:ring-[#004532] outline-none text-sm text-center"
                    />
                  </div>
                </div>
              </div>

              {/* 🟢 SECCIÓN DE PRECIOS POR VOLUMEN / VARIANTES */}
              <div className="bg-[#f8faf9] p-5 rounded-xl border border-[#bec9c2]/30 space-y-5">
                <h3 className="font-bold text-[#004532] text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Package size={16} /> Precios y Presentaciones (Variantes)
                </h3>

                {/* Nivel 1 (Obligatorio) */}
                <div className="grid grid-cols-2 gap-4 items-end bg-white p-3 rounded-lg border border-[#bec9c2]/20 shadow-sm border-l-4 border-l-[#131b2e]">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Etiqueta Principal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.etiqueta_1}
                      onChange={(e) =>
                        setFormData({ ...formData, etiqueta_1: e.target.value })
                      }
                      placeholder="Ej. 1 Pieza"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Precio Base ($) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm font-bold text-[#004532]"
                    />
                  </div>
                </div>

                {/* Nivel 2 (Opcional) */}
                <div className="grid grid-cols-2 gap-4 items-end bg-white p-3 rounded-lg border border-[#bec9c2]/20 shadow-sm border-l-4 border-l-[#004532]">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Etiqueta Nivel 2 (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.etiqueta_2}
                      onChange={(e) =>
                        setFormData({ ...formData, etiqueta_2: e.target.value })
                      }
                      placeholder="Ej. Display 12 Pzas"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Precio Nivel 2 ($)
                    </label>
                    <input
                      type="number"
                      value={formData.precio_2}
                      onChange={(e) =>
                        setFormData({ ...formData, precio_2: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Nivel 3 (Opcional) */}
                <div className="grid grid-cols-2 gap-4 items-end bg-white p-3 rounded-lg border border-[#bec9c2]/20 shadow-sm border-l-4 border-l-emerald-500">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Etiqueta Nivel 3 (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.etiqueta_3}
                      onChange={(e) =>
                        setFormData({ ...formData, etiqueta_3: e.target.value })
                      }
                      placeholder="Ej. Caja 48 Pzas"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Precio Nivel 3 ($)
                    </label>
                    <input
                      type="number"
                      value={formData.precio_3}
                      onChange={(e) =>
                        setFormData({ ...formData, precio_3: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-md outline-none focus:border-[#004532] text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de Guardar / Cancelar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#bec9c2]/30">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#131b2e] hover:bg-[#004532] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
