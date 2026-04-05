"use client";
import { useState } from "react";
import Image from "next/image";
import ProductDetailModal from "./ProductDetailModal";
import { useCart } from "../_context/CartContext";
import { ZoomIn, ShoppingCart, Eye, MessageCircle } from "lucide-react";

export default function ProductCard({ producto, main = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  // 🟢 ESTADO PARA LA VARIANTE EN LA TARJETA
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);

  const imageUrl =
    producto.imagen_url || producto.imagen || "https://via.placeholder.com/300";

  // 🟢 DETERMINAR PRECIO ACTUAL SEGÚN SELECCIÓN
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

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    const productoParaCarrito = {
      ...producto,
      id: `${producto.id}-${opcionSeleccionada}`,
      nombre: `${producto.nombre} (${etiquetaActual})`,
      precio: precioActual,
      varianteSeleccionada: opcionSeleccionada, // 🟢 Guardamos qué variante es
    };
    addToCart(productoParaCarrito);
  };

  // ¿Tiene variantes?
  const tieneVariantes = producto.precio_2 || producto.precio_3;

  return (
    <>
      <article
        className={
          main
            ? "min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] snap-center group flex flex-col bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/20 shrink-0 rounded-xl"
            : "h-full group flex flex-col bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/20 rounded-xl"
        }
      >
        <div
          className="relative w-full h-36 sm:h-56 overflow-hidden bg-white flex items-center justify-center cursor-pointer border-b border-[#bec9c2]/10"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={imageUrl}
            alt={producto.nombre || "Producto WOOX"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-[#131b2e]/0 group-hover:bg-[#131b2e]/5 transition-colors duration-300 flex items-center justify-center">
            <div className="text-[#131b2e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md bg-white/80 rounded-full p-2 flex items-center justify-center">
              <ZoomIn size={24} strokeWidth={1.5} />
            </div>
          </div>
          {producto.stock <= 5 && producto.stock > 0 && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-md rounded-sm">
              ¡Últimas!
            </div>
          )}
        </div>

        <div className="p-3 sm:p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {producto.marca && (
                <span className="bg-[#131b2e] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest shrink-0">
                  {producto.marca}
                </span>
              )}
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#004532] truncate">
                {producto.categoria}
              </span>
            </div>
            {/* 🟢 EL PRECIO SE ACTUALIZA DINÁMICAMENTE */}
            <span className="text-sm sm:text-lg font-black text-[#131b2e] shrink-0">
              ${Number(precioActual)?.toLocaleString()}
            </span>
          </div>

          <h3
            className="text-xs sm:text-lg font-bold tracking-tight text-[#131b2e] mb-3 uppercase line-clamp-2 cursor-pointer hover:text-[#004532] transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            {producto.nombre}
          </h3>

          <p className="hidden sm:block text-[#3f4944] text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
            {producto.descripcion}
          </p>

          <div className="mt-auto flex flex-col gap-2">
            {/* 🟢 NUEVO SELECT DE VARIANTES (Si aplica) */}
            {tieneVariantes && (
              <select
                value={opcionSeleccionada}
                onChange={(e) => setOpcionSeleccionada(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()} // Evita que abra el modal al dar clic
                className="w-full bg-[#f2f3ff] text-[#131b2e] border border-[#bec9c2]/40 text-[10px] sm:text-xs font-bold rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#004532]"
              >
                <option value={1}>{producto.etiqueta_1 || "1 Pieza"}</option>
                {producto.precio_2 && (
                  <option value={2}>{producto.etiqueta_2}</option>
                )}
                {producto.precio_3 && (
                  <option value={3}>{producto.etiqueta_3}</option>
                )}
              </select>
            )}

            <button
              onClick={handleAgregarCarrito}
              className="w-full py-2 sm:py-2.5 bg-[#004532] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#065f46] transition-colors text-[10px] sm:text-xs tracking-widest uppercase shadow-sm"
            >
              <ShoppingCart size={16} strokeWidth={2} />
              Al Carrito
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2 bg-white text-[#131b2e] border border-[#bec9c2]/50 font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#f2f3ff] transition-colors text-[9px] sm:text-[10px] tracking-widest uppercase shadow-sm"
              >
                <Eye size={14} strokeWidth={2} /> Detalles
              </button>
              <a
                href={`https://wa.me/525554946246?text=Hola, me interesa: ${encodeURIComponent(producto.nombre)} (${etiquetaActual}) por $${precioActual}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#131b2e] text-white font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#1e293b] transition-colors text-[9px] sm:text-[10px] tracking-widest uppercase shadow-sm"
              >
                <MessageCircle size={14} strokeWidth={2} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      <ProductDetailModal
        producto={producto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
