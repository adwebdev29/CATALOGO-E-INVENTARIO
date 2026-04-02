"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import ProductFormModal from "@/app/_components/ProductFormModal";

export default function ProductosCRUD() {
  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10; // Muestra 10 productos por página
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchData = useCallback(async () => {
    // 1. Obtener categorías (solo para pasarlas al modal)
    const resCategorias = await supabase
      .from("categorias")
      .select("nombre")
      .order("nombre", { ascending: true });
    if (!resCategorias.error) setCategorias(resCategorias.data || []);

    // 2. Calcular el rango de paginación
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // 3. Obtener solo los productos de la página actual + el conteo total
    const { data, count, error } = await supabase
      .from("productos")
      .select("*", { count: "exact" }) // count exacto para saber el total
      .order("id", { ascending: false })
      .range(from, to);

    if (!error) {
      setProductos(data || []);
      setTotalItems(count || 0);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNuevoProducto = () => {
    setProductoAEditar(null);
    setIsModalOpen(true);
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Supabase bloqueó el borrado.");

      // Si borramos el último item de una página (y no es la primera), retrocedemos
      if (productos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchData();
      }
      alert("🗑️ Producto eliminado");
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Botón flotante superior */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-emerald-900">
            Inventario de Productos
          </h1>
          <p className="text-sm text-slate-500">
            Total registrados: {totalItems}
          </p>
        </div>
        <button
          onClick={handleNuevoProducto}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span>
          <span className="hidden sm:inline">Agregar Producto</span>
        </button>
      </div>

      {/* COMPONENTE MODAL */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categorias={categorias}
        productoAEditar={productoAEditar}
        onSaveSuccess={fetchData}
      />

      {/* TABLA RESPONSIVA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                  Categoría
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Precio
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
                  <td className="p-4 text-slate-600 text-sm">{p.categoria}</td>
                  <td className="p-4 text-emerald-700 font-semibold text-sm">
                    ${p.precio}
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
                    No hay productos en esta página.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-sm font-medium text-slate-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
