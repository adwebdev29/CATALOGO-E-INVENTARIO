"use client";
import { useEffect, useState } from "react";
import { X, ShoppingCart, MessageCircle, Package } from "lucide-react";
import { useCart } from "../_context/CartContext";

export default function ProductDetailModal({ producto, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);

  // Bloquear el scroll de la página solo cuando se abre
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const cerrarModal = () => {
    setOpcionSeleccionada(1);
    onClose();
  };

  if (!isOpen || !producto) return null;

  // 🟢 1. SOLUCIÓN A LA IMAGEN: Leemos ambas variables (imagen_url o imagen)
  const imageUrl =
    producto.imagen_url || producto.imagen || "https://via.placeholder.com/400";

  // Determinar precio y etiqueta actual
  const precioActual =
    opcionSeleccionada === 1
      ? producto.precio
      : opcionSeleccionada === 2
        ? producto.precio_2
        : producto.precio_3;

  const etiquetaActual =
    opcionSeleccionada === 1
      ? producto.etiqueta_1 || "1 Pieza"
      : opcionSeleccionada === 2
        ? producto.etiqueta_2
        : producto.etiqueta_3;

  const tieneVariantes = producto.precio_2 || producto.precio_3;

  const handleAddToCart = () => {
    const productoParaCarrito = {
      ...producto,
      id: `${producto.id}-${opcionSeleccionada}`,
      nombre: `${producto.nombre} (${etiquetaActual})`,
      precio: precioActual,
      varianteSeleccionada: opcionSeleccionada,
    };
    addToCart(productoParaCarrito);
    cerrarModal();
  };

  const waMessage = encodeURIComponent(
    `¡Hola WOOX! Me interesa adquirir: ${producto.nombre} en presentación de ${etiquetaActual} por $${Number(precioActual).toLocaleString()}`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* OVERLAY FONDO */}
      <div
        className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-sm"
        onClick={cerrarModal}
      />

      {/* 🟢 2. SOLUCIÓN DE CLICS: Agregamos onClick={(e) => e.stopPropagation()} para evitar fugas de eventos */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur text-[#131b2e] hover:bg-white hover:text-red-500 rounded-full transition-colors shadow-sm"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* IMAGEN DEL PRODUCTO */}
        <div className="w-full md:w-1/2 bg-[#f2f3ff] p-8 flex items-center justify-center min-h-[300px]">
          <img
            src={imageUrl}
            alt={producto.nombre}
            className="max-w-full max-h-[400px] object-contain drop-shadow-xl"
          />
        </div>

        {/* DETALLES DEL PRODUCTO */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col overflow-y-auto">
          <div className="mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#004532] bg-[#e6f4ed] px-3 py-1 rounded-full">
              {producto.categoria}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight leading-tight mt-4 mb-2">
            {producto.nombre}
          </h2>

          {/* PRECIO GRANDE DINÁMICO */}
          <p className="text-3xl font-black text-[#004532] mb-4">
            ${Number(precioActual).toLocaleString()}
          </p>

          <p className="text-sm text-[#3f4944] leading-relaxed mb-8">
            {producto.descripcion ||
              "Equipo industrial de alta precisión y rendimiento garantizado por WOOX."}
          </p>

          {/* 🟢 SELECT DE VARIANTES EN EL MODAL */}
          {tieneVariantes && (
            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3f4944] mb-3 flex items-center gap-2">
                <Package size={14} className="text-[#004532]" /> Selecciona la
                presentación:
              </h4>
              <select
                value={opcionSeleccionada}
                onChange={(e) => {
                  e.stopPropagation();
                  setOpcionSeleccionada(Number(e.target.value));
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-[#f8faf9] text-[#131b2e] border-2 border-[#bec9c2]/50 text-sm font-bold rounded-xl p-4 focus:outline-none focus:border-[#004532] transition-colors cursor-pointer"
              >
                <option value={1}>
                  {producto.etiqueta_1 || "1 Pieza"} - $
                  {Number(producto.precio).toLocaleString()}
                </option>

                {producto.precio_2 && (
                  <option value={2}>
                    {producto.etiqueta_2} - $
                    {Number(producto.precio_2).toLocaleString()}
                  </option>
                )}

                {producto.precio_3 && (
                  <option value={3}>
                    {producto.etiqueta_3} - $
                    {Number(producto.precio_3).toLocaleString()}
                  </option>
                )}
              </select>
            </div>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#bec9c2]/20">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[#131b2e] hover:bg-[#004532] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingCart size={18} /> Al Carrito
            </button>
            <a
              href={`https://wa.me/525554946246?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> Comprar Ya
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
