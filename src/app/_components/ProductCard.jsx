import Brand from "./Brand";
import CardTitle from "./CardTitle";
import LinkNotes from "./LinkNotes";
import ProductImage from "./ProductImage";
export default function ProductCard({ producto, main = true }) {
  return (
    <article
      className={
        main
          ? "min-w-[80%] max-h-120 md:min-w-90 snap-center bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
          : "h-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
      }
    >
      <div className="h-64 bg-white flex items-center justify-center p-6 relative overflow-hidden">
        <Brand producto={producto} />
        <ProductImage producto={producto} />
      </div>
      <div className="p-6 flex flex-col grow">
        <CardTitle producto={producto} />
        <h3 className="font-poppins font-bold text-xl text-slate-800 mb-3 leading-tight">
          {producto.nombre}
        </h3>
        <p className="text-slate-500 text-sm mb-6 grow leading-relaxed">
          {producto.descripcion}
        </p>
        <LinkNotes
          href={`/contacto?producto=${encodeURIComponent(producto.nombre)}`}
        >
          Cotizar
        </LinkNotes>
      </div>
    </article>
  );
}
