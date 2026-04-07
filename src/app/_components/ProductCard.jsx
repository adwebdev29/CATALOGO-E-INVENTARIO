"use client";
import { useState } from "react";
import Image from "next/image";
import ProductDetailModal from "./ProductDetailModal";
import { useCart } from "@/app/_context/CartContext";
import { ZoomIn, ShoppingCart, Eye, MessageCircle } from "lucide-react";

export default function ProductCard({ producto, main = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 🟢 1. EXTRAEMOS mostrarPrecios DEL CONTEXTO
  const { addToCart, mostrarPrecios } = useCart();
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);

  const imageUrl =
    producto.imagen_url ||
    producto.imagen ||
    "https://placehold.co/400x400/png";

  // CREAMOS EL ARREGLO DE VARIANTES DINÁMICAMENTE
  const variantes = [
    {
      id: 1,
      etiqueta: producto.etiqueta_1 || "1 Pieza",
      precio: producto.precio,
    },
  ];
  if (producto.precio_2)
    variantes.push({
      id: 2,
      etiqueta: producto.etiqueta_2,
      precio: producto.precio_2,
    });
  if (producto.precio_3)
    variantes.push({
      id: 3,
      etiqueta: producto.etiqueta_3,
      precio: producto.precio_3,
    });

  // OBTENEMOS LA VARIANTE ACTUAL SEGÚN LA SELECCIÓN
  const varianteActual =
    variantes.find((v) => v.id === opcionSeleccionada) || variantes[0];

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    const productoParaCarrito = {
      ...producto,
      id: `${producto.id}-${varianteActual.id}`,
      nombre: `${producto.nombre} (${varianteActual.etiqueta})`,
      precio: varianteActual.precio,
      varianteSeleccionada: varianteActual.id,
    };
    addToCart(productoParaCarrito);
  };

  // TRUNCAR DESCRIPCIÓN (Ajusta el número 65 si quieres más o menos letras)
  const MAX_LENGTH = 60; // 🟢 Reducido ligeramente para ajustar al nuevo tamaño
  const descripcionTruncada =
    producto?.descripcion && producto.descripcion.length > MAX_LENGTH
      ? producto.descripcion.substring(0, MAX_LENGTH).trim() + "..."
      : producto?.descripcion;

  return (
    <>
      <article
        className={
          main
            ? // 🟢 REDUJIMOS EL ANCHO: De w-[280/320] a w-[240px] md:w-[280px]
              "w-[240px] md:w-[280px] shrink-0 p-2 sm:p-3 snap-center group flex flex-col bg-white overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/20 rounded-xl max-w-sm"
            : "h-full group flex flex-col bg-white overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/20 rounded-xl min-w-0"
        }
      >
        <div
          // 🟢 REDUJIMOS LA ALTURA DE LA IMAGEN: De h-56 a h-48 para que no se vea tan gigante
          className="relative w-full h-36 sm:h-48 overflow-hidden bg-white flex items-center justify-center cursor-pointer border-b border-[#bec9c2]/10"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={imageUrl}
            alt={producto.nombre || "Producto WOOX"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-[#131b2e]/0 group-hover:bg-[#131b2e]/5 transition-colors duration-300 flex items-center justify-center">
            <div className="text-[#131b2e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md bg-white/80 rounded-full p-2 flex items-center justify-center">
              <ZoomIn size={20} strokeWidth={1.5} />
            </div>
          </div>
          {producto.stock <= 5 && producto.stock > 0 && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-600 text-white text-[8px] sm:text-[9px] font-bold px-2 py-1 uppercase tracking-widest shadow-md rounded-sm">
              ¡Últimas!
            </div>
          )}
        </div>

        {/* 🟢 REDUJIMOS LOS PADDINGS INTERNOS (De p-5 a p-4) */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {producto.marca && (
                <span className="bg-[#131b2e] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest shrink-0">
                  {producto.marca}
                </span>
              )}
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#004532] truncate">
                {producto.categoria}
              </span>
            </div>

            {/* 🟢 CONDICIONAMOS EL PRECIO PRINCIPAL (Texto un poco más pequeño: text-base en vez de text-lg) */}
            {mostrarPrecios ? (
              <span className="text-sm sm:text-base font-black text-[#131b2e] shrink-0">
                ${(Number(varianteActual.precio) || 0).toLocaleString()}
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#004532] uppercase tracking-widest shrink-0"></span>
            )}
          </div>

          <h3
            // 🟢 TEXTO DEL TÍTULO UN POCO MÁS COMPACTO Y MARGEN INFERIOR REDUCIDO
            className="text-sm sm:text-base font-bold tracking-tight text-[#131b2e] mb-2 uppercase line-clamp-2 cursor-pointer hover:text-[#004532] transition-colors break-words max-w-md"
            onClick={() => setIsModalOpen(true)}
          >
            {producto.nombre}
          </h3>

          {/* AQUI SE IMPRIME LA DESCRIPCION RECORTADA */}
          <p className="hidden sm:block text-[#3f4944] text-[11px] sm:text-xs mb-3 leading-relaxed flex-1 line-clamp-2">
            {descripcionTruncada}
          </p>

          <div className="mt-auto flex flex-col gap-2">
            <select
              value={opcionSeleccionada}
              onChange={(e) => setOpcionSeleccionada(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#f2f3ff] text-[#131b2e] border border-[#bec9c2]/40 text-[10px] font-bold rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#004532] cursor-pointer"
            >
              {variantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {/* 🟢 CONDICIONAMOS EL PRECIO EN EL SELECT */}
                  {v.etiqueta}{" "}
                  {mostrarPrecios
                    ? `- $${(Number(v.precio) || 0).toLocaleString()}`
                    : ""}
                </option>
              ))}
            </select>

            <button
              onClick={handleAgregarCarrito}
              // 🟢 PADDINGS DE BOTONES MÁS ESTILIZADOS
              className="w-full py-2 bg-[#004532] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#065f46] transition-colors text-[10px] sm:text-[11px] tracking-widest uppercase shadow-sm"
            >
              <ShoppingCart size={14} strokeWidth={2} />
              Al Carrito
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2 bg-white text-[#131b2e] border border-[#bec9c2]/50 font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#f2f3ff] transition-colors text-[9px] tracking-widest uppercase shadow-sm"
              >
                <Eye size={12} strokeWidth={2} /> Detalles
              </button>

              {/* 🟢 CONDICIONAMOS EL MENSAJE DE WHATSAPP */}
              <a
                href={`https://wa.me/525554946246?text=Hola, me interesa: ${encodeURIComponent(
                  producto.nombre,
                )} (${varianteActual.etiqueta})${mostrarPrecios ? ` por $${varianteActual.precio}` : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#131b2e] text-white font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#1e293b] transition-colors text-[9px] tracking-widest uppercase shadow-sm"
              >
                <MessageCircle size={12} strokeWidth={2} /> WhatsApp
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
