"use client";

export default function Contacto() {
  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-6 sm:px-8 bg-[#faf8ff] text-[#131b2e] w-full flex-1">
      {/* ── HERO HEADER ── */}
      <header className="mb-16">
        <span className="text-[#004532] font-bold tracking-widest text-[0.6875rem] uppercase mb-2 block">
          Contacto Institucional
        </span>
        <h1 className="text-[#131b2e] text-[3rem] sm:text-[3.5rem] font-black tracking-tight leading-[1.1] mb-4">
          Hablemos de su <br />
          próximo <span className="text-[#004532]">desafío.</span>
        </h1>
        <div className="w-24 h-1 bg-[#004532]" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── CONTACT FORM ── */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] relative overflow-hidden border border-[#bec9c2]/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#004532]/5 rounded-full -mr-16 -mt-16" />

          <form
            className="space-y-8 relative z-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                  Nombre Completo
                </label>
                <input
                  className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 placeholder-[#6f7973]/50 text-sm rounded-t-md"
                  placeholder="Ej. Alejandro Valdés"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                  Email Corporativo
                </label>
                <input
                  className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 placeholder-[#6f7973]/50 text-sm rounded-t-md"
                  placeholder="nombre@empresa.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                Asunto
              </label>
              <input
                className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 placeholder-[#6f7973]/50 text-sm rounded-t-md"
                placeholder="¿En qué podemos ayudarle?"
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                Mensaje
              </label>
              <textarea
                className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 placeholder-[#6f7973]/50 resize-none text-sm rounded-t-md"
                placeholder="Describa brevemente su requerimiento..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-gradient-to-br from-[#004532] to-[#065f46] text-white font-bold rounded-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Enviar Mensaje</span>
              <span
                className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform"
                style={{ fontSize: "20px" }}
              >
                send
              </span>
            </button>
          </form>
        </div>

        {/* ── SIDEBAR INFO ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Card */}
          <div className="group bg-white p-8 rounded-xl flex flex-col items-start hover:bg-[#f2f3ff] transition-all border border-[#bec9c2]/20 border-l-4 border-l-emerald-500 shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-lg mb-6 text-emerald-800">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "36px" }}
              >
                forum
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">WhatsApp Directo</h3>
            <p className="text-sm text-[#3f4944] mb-6 leading-relaxed">
              Respuesta inmediata para consultas rápidas y soporte técnico en
              vivo.
            </p>
            <a
              href="https://wa.me/525512345678" /* 🟢 Cambia este número por el tuyo */
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center gap-2 font-bold text-emerald-800 group-hover:underline text-sm"
            >
              <span>Iniciar Chat</span>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                open_in_new
              </span>
            </a>
          </div>

          {/* Email Card */}
          <div className="group bg-white p-8 rounded-xl flex flex-col items-start hover:bg-[#f2f3ff] transition-all border border-[#bec9c2]/20 border-l-4 border-l-[#004532] shadow-sm">
            <div className="bg-[#dae2fd] p-3 rounded-lg mb-6 text-[#004532]">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "36px" }}
              >
                mail
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Correo Electrónico</h3>
            <p className="text-sm text-[#3f4944] mb-6 leading-relaxed">
              Para propuestas formales, documentación técnica y colaboraciones.
            </p>
            <a
              href="mailto:ventas@woox.com" /* 🟢 Cambia este correo por el real */
              className="mt-auto flex items-center gap-2 font-bold text-[#004532] group-hover:underline text-sm"
            >
              <span>Enviar Email</span>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                alternate_email
              </span>
            </a>
          </div>

          {/* Info Panel */}
          <div className="bg-[#131b2e] text-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#004532]/20 rounded-full blur-3xl" />
            <h4 className="text-[#8bd6b6] font-black text-xs uppercase tracking-[0.2em] mb-8">
              Información Corporativa
            </h4>
            <ul className="space-y-6 relative z-10">
              {[
                { icon: "call", label: "Teléfono", value: "+52 55 1234 5678" },
                {
                  icon: "location_on",
                  label: "Dirección",
                  value: "Parque Industrial\nNaucalpan, Edo. Mex",
                },
                {
                  icon: "schedule",
                  label: "Horario",
                  value: "Lunes a Viernes\n09:00 - 18:30 hrs",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-[#8bd6b6]"
                    style={{ fontSize: "20px" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-medium whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── MAP VISUAL ── */}
      <section className="mt-20 rounded-2xl overflow-hidden grayscale contrast-125 opacity-80 h-80 relative">
        <img
          className="w-full h-full object-cover"
          alt="Mapa Naucalpan HQ"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8sAnBu67bPk3OIDrgjXSksTXcZb9-0pWF1I8hxS76F0rle9WCwTF_D4IrtS-tsOrUBz974338TpgOIBujtsPiETettIy2EmG7aPE3fC3ehaxaPTaZx8beiNhFuf5DurgnvD4hUHfk_2NlXqiiGtN8iJusQpUj2U0nuGGDvhJknb0dOxBgVxilkzZb-SPU9SUgLgJe8Ivl1jdUnBaDaqkZGCnCtcw8CjiF_NvPE0cRTUlIAinb9YfulKTdA10Rtzj8ag_Wc9HIDxOM"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="bg-[#004532] px-4 py-1 inline-block text-[0.6rem] font-black uppercase tracking-widest mb-2">
            Ubicación Central
          </div>
          <p className="text-2xl font-bold">Naucalpan HQ</p>
        </div>
      </section>
    </main>
  );
}
