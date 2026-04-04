"use client";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductCard({ producto, main = true }) {
  // 🟢 ESTADO PARA CONTROLAR EL MODAL DE ESTA TARJETA
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article
        className={
          main
            ? "min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] snap-center group flex flex-col bg-[#f2f3ff] overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/10 shrink-0"
            : "h-full group flex flex-col bg-[#f2f3ff] overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/10"
        }
      >
        {/* 🟢 ZONA DE LA IMAGEN (Ahora es clickeable) */}
        <div
          className="relative w-full h-56 sm:h-64 overflow-hidden bg-white flex items-center justify-center cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={
              producto.imagen_url ||
              producto.imagen ||
              "https://via.placeholder.com/300"
            }
          />

          {/* Capa oscura al hacer hover (Indicador visual de que es clickeable) */}
          <div className="absolute inset-0 bg-[#131b2e]/0 group-hover:bg-[#131b2e]/10 transition-colors duration-300 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
              style={{ fontSize: "32px" }}
            >
              zoom_in
            </span>
          </div>

          {/* Etiqueta de Stock */}
          {producto.stock <= 5 && producto.stock > 0 && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-md">
              ¡Últimas piezas!
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 border-t border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#004532]">
              {producto.categoria || producto.marca}
            </span>
            <span className="text-lg font-black text-[#131b2e]">
              ${Number(producto.precio)?.toLocaleString()}
            </span>
          </div>

          <h3
            className="text-lg font-bold tracking-tight text-[#131b2e] mb-4 h-12 flex items-center uppercase line-clamp-2 cursor-pointer hover:text-[#004532] transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            {producto.nombre}
          </h3>

          <p className="text-[#3f4944] text-xs mb-6 line-clamp-2 leading-relaxed flex-1">
            {producto.descripcion}
          </p>

          {/* 🟢 NUEVA ZONA DE BOTONES (Detalles + WhatsApp) */}
          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 bg-white text-[#131b2e] border border-[#bec9c2]/50 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#dae2fd] transition-colors text-xs tracking-widest uppercase shadow-sm"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontSize: "16px" }}
              >
                visibility
              </span>
              Ver Detalles
            </button>

            <a
              href={`https://wa.me/525512345678?text=Hola, me interesa el producto: ${encodeURIComponent(producto.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#131b2e] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#004532] transition-colors text-xs tracking-widest uppercase shadow-sm"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontSize: "16px" }}
              >
                chat
              </span>
              Pedir WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* 🟢 RENDERIZAMOS EL MODAL AQUÍ MISMO */}
      <ProductDetailModal
        producto={producto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
