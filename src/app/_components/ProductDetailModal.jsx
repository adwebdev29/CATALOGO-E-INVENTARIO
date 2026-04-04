"use client";

import { useEffect } from "react";

export default function ProductDetailModal({ producto, isOpen, onClose }) {
  // Evitar que el fondo haga scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !producto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm transition-opacity"
      onClick={onClose} // Cierra al hacer clic en el fondo gris
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro de la tarjeta
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#f2f3ff] hover:text-red-500 transition-colors shadow-sm"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "24px" }}
          >
            close
          </span>
        </button>

        {/* Imagen del Producto */}
        <div className="w-full md:w-1/2 bg-slate-100 flex items-center justify-center p-8 min-h-[300px]">
          <img
            src={
              producto.imagen_url ||
              producto.imagen ||
              "https://via.placeholder.com/400"
            }
            alt={producto.nombre}
            className="w-full h-full object-contain max-h-[400px] hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004532] bg-[#a6f2d1]/30 px-3 py-1 rounded-full">
              {producto.categoria || producto.marca}
            </span>
            {producto.stock <= 5 && producto.stock > 0 && (
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100 px-3 py-1 rounded-full">
                ¡Últimas piezas!
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-[#131b2e] uppercase tracking-tighter leading-tight mb-4">
            {producto.nombre}
          </h2>

          <div className="text-3xl font-black text-[#004532] mb-6">
            ${Number(producto.precio)?.toLocaleString()}
          </div>

          <p className="text-[#3f4944] text-sm md:text-base leading-relaxed mb-8 flex-1 border-t border-[#bec9c2]/30 pt-6">
            {producto.descripcion ||
              "Un equipo de alto rendimiento diseñado para la excelencia arquitectónica y profesional."}
          </p>

          {/* Botones de Acción */}
          <div className="flex gap-4 mt-auto">
            <a
              href={`https://wa.me/525512345678?text=Hola, me interesa el producto: ${encodeURIComponent(producto.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 bg-[#131b2e] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#004532] transition-colors text-xs tracking-widest uppercase shadow-lg"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                chat
              </span>
              Cotizar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
