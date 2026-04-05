"use client";
import { useCart } from "@/app/_context/CartContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    changeItemVariant, // 🟢 Importamos nuestra nueva función
    totalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  // Generar mensaje de WhatsApp detallado
  const getWhatsAppMessage = () => {
    let message =
      "¡Hola, equipo de WOOX! Me gustaría cotizar los siguientes productos:\n\n";
    cart.forEach((item) => {
      message += `• ${item.nombre}\n  Cant: ${item.quantity} x $${Number(item.precio).toLocaleString()} = $${(item.precio * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*TOTAL ESTIMADO: $${totalPrice.toLocaleString()}*`;
    return encodeURIComponent(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* OVERLAY FONDO OSCURO */}
      <div
        className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* PANEL LATERAL DEL CARRITO */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col slide-in-from-right-full duration-300 border-l border-[#bec9c2]/30">
        {/* HEADER DEL CARRITO */}
        <div className="flex items-center justify-between p-6 border-b border-[#bec9c2]/20 bg-[#f8faf9]">
          <h2 className="text-xl font-black text-[#131b2e] flex items-center gap-2 uppercase tracking-tight">
            <ShoppingBag className="text-[#004532]" />
            Tu Cotización
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#bec9c2] hover:text-red-500 hover:bg-white rounded-full transition-all shadow-sm"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* CONTENIDO (LISTA DE PRODUCTOS) */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#faf8ff]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#bec9c2] space-y-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="text-lg font-bold text-[#3f4944]">
                El carrito está vacío
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-3 bg-[#131b2e] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#004532] transition-colors shadow-md"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="p-4 bg-white border border-[#bec9c2]/30 rounded-xl shadow-sm flex gap-4 transition-all hover:shadow-md hover:border-[#bec9c2]/60"
                >
                  {/* IMAGEN DEL PRODUCTO */}
                  <div className="w-20 h-20 bg-[#f2f3ff] rounded-lg p-2 shrink-0 border border-[#bec9c2]/20">
                    <img
                      src={item.imagen_url || "https://via.placeholder.com/150"}
                      alt={item.nombre}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* INFO Y CONTROLES */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        {/* Nombre del producto sin la etiqueta entre paréntesis para que no sea redundante */}
                        <h4 className="font-bold text-[#131b2e] text-sm leading-tight truncate">
                          {item.nombre.split("(")[0].trim()}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#bec9c2] hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[#004532] font-black mt-1">
                        ${Number(item.precio).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      {/* 🟢 SELECT DE VARIANTES EN EL CARRITO (Solo si el item tiene opciones guardadas) */}
                      {(item.precio_2 || item.precio_3) && (
                        <select
                          value={item.varianteSeleccionada || 1}
                          onChange={(e) =>
                            changeItemVariant(
                              item.id,
                              Number(e.target.value),
                              item,
                            )
                          }
                          className="w-full bg-[#f8faf9] border border-[#bec9c2]/40 text-[10px] font-bold text-[#3f4944] uppercase tracking-wider rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-[#004532]"
                        >
                          <option value={1}>
                            {item.etiqueta_1 || "1 Pieza"}
                          </option>
                          {item.precio_2 && (
                            <option value={2}>{item.etiqueta_2}</option>
                          )}
                          {item.precio_3 && (
                            <option value={3}>{item.etiqueta_3}</option>
                          )}
                        </select>
                      )}

                      {/* CONTROLES DE CANTIDAD */}
                      <div className="flex items-center gap-3 bg-[#f2f3ff] w-max rounded-lg p-1 border border-[#bec9c2]/20">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-white hover:text-[#004532] rounded text-[#3f4944] transition-colors shadow-sm"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-[#131b2e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-white hover:text-[#004532] rounded text-[#3f4944] transition-colors shadow-sm"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER DEL CARRITO (TOTALES Y BOTONES) */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#bec9c2]/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-xs font-bold text-[#3f4944] uppercase tracking-widest">
                Total Estimado
              </span>
              <span className="text-3xl font-black text-[#131b2e] tracking-tight">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Botón a la Página de Contacto/Checkout */}
              <Link
                href="/contacto"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-[#131b2e] hover:bg-[#004532] text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-all rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Solicitar Cotización Formal
              </Link>

              {/* Botón Directo a WhatsApp */}
              <a
                href={`https://wa.me/525554946246?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all rounded-xl shadow-sm hover:shadow-md"
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                Pedir por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
