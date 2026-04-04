"use client";
import { useCart } from "../_context/CartContext";
import { useRouter } from "next/navigation";
// 🟢 1. Importamos los íconos de Lucide
import { ShoppingCart, X, Trash2, MessageCircle, Mail } from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    getWhatsAppMessage,
  } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleGoToContact = () => {
    setIsCartOpen(false);
    router.push("/contacto");
  };

  return (
    <>
      {/* 🟢 Overlay con animación de aparición suave */}
      <div
        className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* 🟢 Drawer con animación de deslizamiento desde la derecha */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#bec9c2]/20 bg-[#131b2e] text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} strokeWidth={2} />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Carrito
            </h2>
            {totalItems > 0 && (
              <span className="bg-[#8bd6b6] text-[#131b2e] text-[10px] font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#faf8ff]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-4">
              <ShoppingCart
                size={64}
                strokeWidth={1}
                className="text-[#bec9c2]"
              />
              <p className="font-bold text-lg text-[#131b2e]">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-[#3f4944]">
                Agrega productos desde el catálogo para cotizar.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/catalogo");
                }}
                className="mt-4 bg-[#004532] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#131b2e] shadow-md transition-colors"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 rounded-xl border border-[#bec9c2]/30 shadow-sm"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                  <img
                    src={
                      item.imagen_url ||
                      item.imagen ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.nombre}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-xs font-bold text-[#131b2e] line-clamp-2 uppercase leading-tight mb-1">
                    {item.nombre}
                  </p>
                  <p className="text-[#004532] font-black text-sm">
                    ${(item.precio * item.quantity).toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-[#f2f3ff] rounded-md border border-[#bec9c2]/30 p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-white rounded text-[#131b2e] hover:bg-slate-100 flex items-center justify-center font-bold shadow-sm"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-[#131b2e]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-white rounded text-[#131b2e] hover:bg-slate-100 flex items-center justify-center font-bold shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con totales y botones */}
        {cart.length > 0 && (
          <div className="border-t border-[#bec9c2]/30 px-6 py-6 space-y-4 bg-white shadow-[0_-10px_30px_rgba(19,27,46,0.03)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-[#3f4944] uppercase tracking-widest">
                Inversión estimada
              </span>
              <span className="text-2xl font-black text-[#131b2e]">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            {/* 🟢 WhatsApp directo (Color oficial y sombra) */}
            <a
              href={`https://wa.me/525564246246?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle size={18} strokeWidth={2} />
              Pedir por WhatsApp
            </a>

            {/* Ir a contacto */}
            <button
              onClick={handleGoToContact}
              className="w-full py-3.5 border-2 border-[#131b2e] text-[#131b2e] font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#131b2e] hover:text-white transition-all rounded-lg shadow-sm"
            >
              <Mail size={16} strokeWidth={2} />
              Solicitar Cotización Formal
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
