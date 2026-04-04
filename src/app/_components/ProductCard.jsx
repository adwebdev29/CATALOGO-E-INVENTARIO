import Link from "next/link";

export default function ProductCard({ producto, main = true }) {
  return (
    <article
      className={
        main
          ? "min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] snap-center group flex flex-col bg-[#f2f3ff] overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/10 shrink-0"
          : "h-full group flex flex-col bg-[#f2f3ff] overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#bec9c2]/10"
      }
    >
      {/* 🟢 AQUÍ ESTÁ EL ARREGLO: Altura fija (h-56 / h-64) en lugar de aspect-square */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-white flex items-center justify-center">
        <img
          alt={producto.nombre}
          /* 💡 Nota: Si tus productos tienen fondo blanco, cambia 'object-cover' por 'object-contain p-4' para que no se recorten */
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={
            producto.imagen_url ||
            producto.imagen ||
            "https://via.placeholder.com/300"
          }
        />
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
            ${producto.precio?.toLocaleString()}
          </span>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-[#131b2e] mb-4 h-12 flex items-center uppercase line-clamp-2">
          {producto.nombre}
        </h3>

        <p className="text-[#3f4944] text-xs mb-6 line-clamp-2 leading-relaxed flex-1">
          {producto.descripcion}
        </p>

        <div className="mt-auto">
          <a
            href={`https://wa.me/?text=Hola, me interesa: ${encodeURIComponent(producto.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#131b2e] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#004532] transition-colors text-xs tracking-widest uppercase shadow-sm"
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
  );
}
