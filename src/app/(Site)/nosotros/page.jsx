import Link from "next/link";

export default function Nosotros() {
  return (
    <main className="bg-[#faf8ff] text-[#131b2e] w-full flex-1">
      {/* ── HERO ── */}
      <section className="relative h-[600px] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Nuestra Misión"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcygYg8stMc0Wb2DT3AnMBEeYWvim-XEMHDefKK5y5tRTjW0Q7T66qt1bdYsjYy6u3I_kzUhOYtaH7XLWFuRZ7ta2fCNGkcgbQ1XBtZBas_pcEZuO4gHYuAoRgAYmnFLX3U2q5yi8-kFChDoplxU_-yV5LLP1SYDJhKDwCeendgVg9oGG9JooOIIplSxDQ2gh8KMooWyOtH-orZ8thywV5R1Ik2uPYdxD8dXxKR8UWjVVTfTR64x0b-u9MclLOZsNNWnospyCdGY4U"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e]/90 via-[#131b2e]/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full mt-16">
          <div className="max-w-2xl">
            <span className="inline-block text-[#8bd6b6] font-bold tracking-[0.2em] text-xs uppercase mb-4">
              Misión Institucional
            </span>
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
              Nuestra Misión
            </h1>
            <p className="text-[#e2e7ff] text-base sm:text-lg leading-relaxed font-light">
              Redefinir la relación entre la humanidad y la tecnología a través
              de un diseño arquitectónico impecable y una funcionalidad sin
              precedentes.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOBRE WOOX ── */}
      <section className="py-24 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 text-[#004532] font-bold text-sm tracking-widest uppercase">
                <span className="w-8 h-px bg-[#004532]" />
                Sobre Woox
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#131b2e] tracking-tight leading-tight">
                Líderes en la arquitectura de{" "}
                <span className="text-[#065f46]">accesorios tecnológicos.</span>
              </h2>
              <div className="space-y-6 text-[#3f4944] text-base sm:text-lg leading-relaxed">
                <p>
                  Woox no es simplemente una marca de accesorios; es un estándar
                  de excelencia en la industria tecnológica. Fundada bajo la
                  premisa de que la tecnología debe ser tan estética como
                  funcional, nos hemos consolidado como líderes en la provisión
                  de gadgets premium.
                </p>
                <p>
                  Nuestro compromiso con la calidad y la innovación se refleja
                  en cada fibra de nuestros productos. Desde soluciones de
                  conectividad de alta velocidad hasta periféricos de diseño
                  ergonómico, cada pieza es sometida a rigurosas pruebas de
                  rendimiento.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-8">
                <div className="bg-[#f2f3ff] p-6 rounded-md">
                  <div className="text-2xl sm:text-3xl font-black text-[#004532] mb-1">
                    15k+
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#3f4944]">
                    Clientes Globales
                  </div>
                </div>
                <div className="bg-[#f2f3ff] p-6 rounded-md">
                  <div className="text-2xl sm:text-3xl font-black text-[#004532] mb-1">
                    99.9%
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#3f4944]">
                    Índice de Calidad
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden sm:block">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative z-10">
                <img
                  alt="Tech detail"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwIA1oN46rTUHF85O8KHD9cod4TmESkUAplKhV2fOp3GDiS2RhrVnQrps6skP9UWpryKNU8na1LTwG99V6AFx3ScJyz3ADr0HCDJo-nq6BBGnnfEN-E4sidrClzXaHrHH_wnbDhxb0bbL91NzvXbpWUvrWyCHqRFbaZvI10KCxeQ123L0G9EGW651SXFPPFwdYaKDeSWvfF06kAWfcvS0EV6PdOTpm2vC6moiciY0No8lqCY8izEQOGR3Cn_vaMCjxtIjIqB-aOOCt"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#a6f2d1] rounded-full -z-0 opacity-20 blur-3xl" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#dae2fd] rounded-full -z-0 opacity-30 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PILARES ── */}
      <section className="py-24 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004532] mb-3 block">
              Nuestros Fundamentos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#131b2e] uppercase">
              Pilares <span className="text-[#004532]">Institucionales</span>
            </h2>
            <div className="w-24 h-1 bg-[#004532] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "bolt",
                title: "Misión",
                desc: "Proveer soluciones tecnológicas de excelencia que maximicen la productividad de nuestros clientes, garantizando calidad, diseño y confiabilidad en cada producto.",
              },
              {
                icon: "visibility",
                title: "Visión",
                desc: "Ser el referente regional en soluciones tecnológicas premium, reconocidos por nuestra excelencia arquitectónica, innovación y compromiso con el profesional moderno.",
              },
              {
                icon: "verified",
                title: "Valores",
                desc: "Honestidad en cada recomendación, calidad en cada componente y compromiso total con los tiempos de entrega y la satisfacción del cliente.",
              },
            ].map((pilar) => (
              <div
                key={pilar.title}
                className="group bg-white border border-[#bec9c2]/10 p-8 sm:p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#004532]/3 rounded-full -mr-12 -mt-12 group-hover:bg-[#004532]/6 transition-all" />
                <div className="text-[#004532] mb-6 group-hover:scale-110 transition-transform inline-block">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "40px" }}
                  >
                    {pilar.icon}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#131b2e] uppercase tracking-tight mb-4">
                  {pilar.title}
                </h3>
                <div className="w-12 h-0.5 bg-[#004532] mb-4" />
                <p className="text-[#3f4944] leading-relaxed text-sm">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UBICACIÓN ── */}
      <section className="py-24 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold text-[#131b2e] mb-4">
              Nuestra Ubicación
            </h2>
            <p className="text-[#3f4944]">
              Visita nuestro centro de innovación y oficinas corporativas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(19,27,46,0.06)] bg-white border border-[#bec9c2]/20">
            {/* Map placeholder */}
            <div className="lg:col-span-3 h-[300px] lg:h-[400px] relative bg-slate-200 flex items-center justify-center overflow-hidden">
              <img
                alt="Mapa"
                className="w-full h-full object-cover opacity-50 grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0azZ3CQZ5StP1U5v4mfRz7mTNDnjONkjF2sWzOlPr8er5jzHfep6LsLcseiyGZ_vQHNbqN3vOTVgFxRsdFAOJqqLpFUxTuplOHlKTLdMutVHs178JETDUMbM4Ss6PkTY9Aw6v6vhUDzOzmXaACnOAwpYy02ZHzYILFf3G8KaLpsCUF-wGdKbst3wTOG2qSuNy9T16gO__mE4r_czsYL2F2RDu-qz-jXYMsTILo6idoIptrMwRK7jEbyByAMRb-aLMAU28eYMYVUU1"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#004532] text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: "'FILL' 1",
                      fontSize: "24px",
                    }}
                  >
                    location_on
                  </span>
                </div>
              </div>
            </div>

            {/* Info panel - 🟢 Actualizado con los datos de Naucalpan */}
            <div className="lg:col-span-1 bg-[#131b2e] p-8 sm:p-10 text-white flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[#8bd6b6] text-xs font-black uppercase tracking-[0.2em] mb-4">
                    Sede Central
                  </h3>
                  <p className="text-lg sm:text-xl font-bold leading-tight">
                    Parque Industrial,
                    <br />
                    Naucalpan, Edo. Mex
                  </p>
                </div>
                <div className="space-y-5">
                  {[
                    { icon: "mail", label: "Email", value: "ventas@woox.com" },
                    {
                      icon: "call",
                      label: "Teléfono",
                      value: "+52 55 1234 5678",
                    },
                    {
                      icon: "schedule",
                      label: "Horario",
                      value: "Lun - Vie: 09:00 - 18:30",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <span
                        className="material-symbols-outlined text-[#8bd6b6]"
                        style={{ fontSize: "20px" }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          {item.label}
                        </p>
                        <p className="text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/contacto"
                  className="block w-full py-4 text-center border border-white/20 hover:bg-white hover:text-[#131b2e] transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
