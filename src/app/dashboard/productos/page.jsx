"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import ProductFormModal from "@/app/_components/ProductFormModal";

export default function ProductosCRUD() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // 🟢 ESTADOS DE BÚSQUEDA Y FILTROS
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("recientes"); // recientes, precio-asc, precio-desc, stock-bajo, stock-alto

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchData = useCallback(async () => {
    // 1. Obtener categorías
    const resCategorias = await supabase
      .from("categorias")
      .select("nombre")
      .order("nombre", { ascending: true });
    if (!resCategorias.error) setCategorias(resCategorias.data || []);

    // 2. Construir la consulta a Supabase dinámicamente
    let query = supabase.from("productos").select("*", { count: "exact" });

    // Filtrar por texto (si hay algo escrito)
    if (busqueda) query = query.ilike("nombre", `%${busqueda}%`);
    // Filtrar por categoría
    if (filtroCategoria) query = query.eq("categoria", filtroCategoria);

    // Ordenamiento dinámico
    switch (ordenarPor) {
      case "precio-asc":
        query = query.order("precio", { ascending: true });
        break;
      case "precio-desc":
        query = query.order("precio", { ascending: false });
        break;
      case "stock-bajo":
        query = query.order("stock", { ascending: true });
        break;
      case "stock-alto":
        query = query.order("stock", { ascending: false });
        break;
      default:
        query = query.order("id", { ascending: false });
        break; // recientes
    }

    // Paginación
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    // Ejecutar consulta
    const { data, count, error } = await query;
    if (!error) {
      setProductos(data || []);
      setTotalItems(count || 0);
    }
  }, [currentPage, busqueda, filtroCategoria, ordenarPor]);

  // Efecto con "Debounce" para el buscador (espera medio segundo a que dejes de teclear para buscar)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Resetear página a 1 cada que cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroCategoria, ordenarPor]);

  const handleNuevoProducto = () => {
    setProductoAEditar(null);
    setIsModalOpen(true);
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que quieres eliminar este producto? Esta acción también borrará su imagen física.",
      )
    )
      return;

    try {
      // 1. Buscamos el producto en nuestro estado actual para obtener la URL de la imagen antes de borrarlo
      const productoABorrar = productos.find((p) => p.id === id);
      const urlImagen = productoABorrar?.imagen_url;

      // 2. Borramos la fila de la base de datos
      const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Supabase bloqueó el borrado.");

      // 3. Si el borrado en la DB fue exitoso y el producto tenía una imagen propia (no una URL externa)
      // Las imágenes de nuestro bucket contienen "/storage/v1/object/public/productos/"
      if (urlImagen && urlImagen.includes("/productos/")) {
        try {
          // Extraemos el nombre del archivo de la URL
          // La URL es: .../public/productos/nombre-archivo.webp
          const nombreArchivo = urlImagen.split("/").pop();

          if (nombreArchivo) {
            const { error: storageError } = await supabase.storage
              .from("productos")
              .remove([nombreArchivo]);

            if (storageError) {
              console.warn(
                "⚠️ La fila se borró, pero no se pudo eliminar el archivo del Storage:",
                storageError.message,
              );
            } else {
              console.log("🗑️ Imagen eliminada del Storage con éxito.");
            }
          }
        } catch (err) {
          console.error("Error al intentar limpiar el Storage:", err);
        }
      }

      // 4. Refrescar la interfaz
      if (productos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchData();
      }

      alert("🗑️ Producto e imagen eliminados correctamente.");
    } catch (error) {
      console.error("Error en el proceso de eliminación:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🟢 CABECERA Y BARRA DE HERRAMIENTAS (Buscador + Filtros) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-emerald-900">
              Inventario de Productos
            </h1>
            <p className="text-sm text-slate-500">
              Total resultados: {totalItems}
            </p>
          </div>
          <button
            onClick={handleNuevoProducto}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <span className="text-xl leading-none">+</span> Agregar Producto
          </button>
        </div>

        {/* Zona de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm bg-white text-slate-700"
            >
              <option value="">Todas las Categorías</option>
              {categorias.map((c, i) => (
                <option key={i} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm bg-white text-slate-700"
            >
              <option value="recientes">Más Recientes</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="stock-bajo">Stock: Por Agotarse</option>
              <option value="stock-alto">Stock: Más Abundantes</option>
            </select>
          </div>
        </div>
      </div>

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
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
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
                  Stock
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
                  {/* 🟢 INDICADOR VISUAL DE STOCK */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock <= 5 ? "bg-red-100 text-red-700" : p.stock <= 20 ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {p.stock} uds.
                    </span>
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
                    colSpan="6"
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    No se encontraron productos con esos filtros.
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
