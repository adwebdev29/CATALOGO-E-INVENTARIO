import ScrollReveal from "../../_components/ScrollReveal";
import { ShieldCheck, PackageCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Política de Garantía",
  description:
    "Conoce nuestra política de garantía de 30 días para todos nuestros accesorios y equipos electrónicos.",
};

export default function GarantiaPage() {
  return (
    <main className="pt-24 pb-20 max-w-5xl mx-auto px-6 sm:px-8 text-[#131b2e] w-full flex-1 overflow-hidden">
      {/* ── ENCABEZADO ── */}
      <ScrollReveal direction="up">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#e6f4ed] rounded-full mb-6">
            <ShieldCheck
              size={48}
              strokeWidth={1.5}
              className="text-[#004532]"
            />
          </div>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] font-black tracking-tight leading-[1.1] mb-4">
            Política de <span className="text-[#004532]">Garantía</span>
          </h1>
          <p className="text-[#3f4944] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            En WOOX nos comprometemos con la calidad de nuestros productos.
            Conoce los lineamientos para hacer válida tu garantía de forma
            rápida y transparente.
          </p>
        </header>
      </ScrollReveal>

      {/* ── TARJETAS DE POLÍTICAS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Tarjeta 1 */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#bec9c2]/20 h-full hover:shadow-md transition-shadow">
            <div className="text-[#004532] mb-4">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-3">
              30 Días de Cobertura
            </h3>
            <p className="text-sm text-[#3f4944] leading-relaxed">
              Todos nuestros productos cuentan con una garantía directa de{" "}
              <strong>30 días</strong> a partir de la fecha en la que recibes tu
              pedido frente a defectos de fábrica.
            </p>
          </div>
        </ScrollReveal>

        {/* Tarjeta 2 */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#bec9c2]/20 h-full hover:shadow-md transition-shadow">
            <div className="text-[#004532] mb-4">
              <PackageCheck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-3">
              Condiciones del Equipo
            </h3>
            <p className="text-sm text-[#3f4944] leading-relaxed">
              Para hacer válida la garantía, la mercancía debe encontrarse en{" "}
              <strong>buen estado físico</strong>, sin daños por mal uso, y debe
              incluir su <strong>caja y accesorios completos</strong>{" "}
              originales.
            </p>
          </div>
        </ScrollReveal>

        {/* Tarjeta 3 */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#bec9c2]/20 h-full hover:shadow-md transition-shadow">
            <div className="text-[#004532] mb-4">
              <Truck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-3">
              Logística y Envíos
            </h3>
            <p className="text-sm text-[#3f4944] leading-relaxed">
              El costo de la guía de envío hacia nuestras instalaciones corre{" "}
              <strong>por parte del cliente</strong>. Una vez validada, el costo
              de la guía de regreso con el reemplazo corre{" "}
              <strong>por parte de la empresa</strong>.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.4}>
        <div className="text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#004532] hover:text-[#131b2e] transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Catálogo
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
