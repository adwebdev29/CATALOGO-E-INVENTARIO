"use client";
import { useCart } from "../_context/CartContext";
import { useRouter } from "next/navigation";

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
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#131b2e] text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">shopping_cart</span>
            <h2 className="text-lg font-black uppercase tracking-widest">
              Carrito
            </h2>
            {totalItems > 0 && (
              <span className="bg-[#004532] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-4">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "64px" }}
              >
                shopping_cart
              </span>
              <p className="font-bold text-lg">Tu carrito está vacío</p>
              <p className="text-sm">
                Agrega productos desde el catálogo para continuar.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/catalogo");
                }}
                className="bg-[#004532] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#131b2e] transition-colors"
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-[#f2f3ff] p-4 rounded-lg border border-[#bec9c2]/20"
              >
                <img
                  src={
                    item.imagen_url ||
                    item.imagen ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.nombre}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#131b2e] line-clamp-2 uppercase">
                    {item.nombre}
                  </p>
                  <p className="text-[#004532] font-black text-base mt-1">
                    ${(item.precio * item.quantity).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 bg-white border border-slate-200 rounded font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 bg-white border border-slate-200 rounded font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "18px" }}
                      >
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con totales y botones */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-5 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Total estimado
              </span>
              <span className="text-2xl font-black text-[#131b2e]">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            {/* WhatsApp directo */}
            <a
              href={`https://wa.me/525564246246?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors rounded-lg"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontSize: "18px" }}
              >
                chat
              </span>
              Pedir por WhatsApp
            </a>

            {/* Ir a contacto */}
            <button
              onClick={handleGoToContact}
              className="w-full py-3 border-2 border-[#131b2e] text-[#131b2e] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#131b2e] hover:text-white transition-colors rounded-lg"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontSize: "18px" }}
              >
                mail
              </span>
              Solicitar por correo / más info
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
