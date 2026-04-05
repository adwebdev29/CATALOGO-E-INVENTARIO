"use client";
import { useEffect, useState } from "react";
import { X, ShoppingCart, MessageCircle, Package } from "lucide-react";
import { useCart } from "@/app/_context/CartContext";

export default function ProductDetailModal({ producto, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(1);

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

  const imageUrl =
    producto.imagen_url || producto.imagen || "https://via.placeholder.com/400";

  // 🟢 ARREGLO DE VARIANTES DINÁMICO
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

  const varianteActual =
    variantes.find((v) => v.id === opcionSeleccionada) || variantes[0];

  const handleAddToCart = () => {
    const productoParaCarrito = {
      ...producto,
      id: `${producto.id}-${varianteActual.id}`,
      nombre: `${producto.nombre} (${varianteActual.etiqueta})`,
      precio: varianteActual.precio,
      varianteSeleccionada: varianteActual.id,
    };
    addToCart(productoParaCarrito);
    cerrarModal();
  };

  const waMessage = encodeURIComponent(
    `¡Hola WOOX! Me interesa adquirir: ${producto.nombre} en presentación de ${varianteActual.etiqueta} por $${Number(varianteActual.precio).toLocaleString()}`,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-sm"
        onClick={cerrarModal}
      />
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={cerrarModal}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur text-[#131b2e] hover:bg-white hover:text-red-500 rounded-full transition-colors shadow-sm"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="w-full md:w-1/2 bg-[#f2f3ff] p-8 flex items-center justify-center min-h-[300px]">
          <img
            src={imageUrl}
            alt={producto.nombre}
            className="max-w-full max-h-[400px] object-contain drop-shadow-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col overflow-y-auto">
          <div className="mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#004532] bg-[#e6f4ed] px-3 py-1 rounded-full">
              {producto.categoria}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight leading-tight mt-4 mb-2">
            {producto.nombre}
          </h2>

          <p className="text-3xl font-black text-[#004532] mb-4">
            ${Number(varianteActual.precio).toLocaleString()}
          </p>

          <p className="text-sm text-[#3f4944] leading-relaxed mb-8">
            {producto.descripcion ||
              "Equipo industrial de alta precisión y rendimiento garantizado."}
          </p>

          {/* 🟢 SIEMPRE SE RENDERIZA EL SELECT */}
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
              {variantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.etiqueta} - ${Number(v.precio).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#bec9c2]/20">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[#131b2e] hover:bg-[#004532] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
            >
              <ShoppingCart size={18} /> Al Carrito
            </button>
            <a
              href={`https://wa.me/525554946246?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md"
            >
              <MessageCircle size={18} /> Comprar Ya
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
