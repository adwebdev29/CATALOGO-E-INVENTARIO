import Link from "next/link";
// 🟢 Agregamos el ícono de Phone de Lucide
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#131b2e] text-white pt-16 pb-8 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-black tracking-widest mb-4">WOOX</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Equipamiento especializado para lubricación, control de fluidos y
            mantenimiento automotriz de alto rendimiento.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8bd6b6] mb-4">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/catalogo"
                className="hover:text-white transition-colors"
              >
                Catálogo Completo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8bd6b6] mb-4">
            Contacto
          </h3>
          {/* 🟢 LISTA ACTUALIZADA CON TU NÚMERO Y CORREO */}
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#8bd6b6]" />
              +52 55 5494 6246
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#8bd6b6]" />
              wooxmexico@gmail.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-[#8bd6b6]" />
              Naucalpan, Edo. Mex
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center border-t border-white/10 pt-8 text-xs text-slate-500 uppercase tracking-widest">
        © {new Date().getFullYear()} WOOX Technologies. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
