"use client";
import { useState } from "react";
import { useCart } from "@/app/_context/CartContext";

import {
  CheckCircle,
  ShoppingCart,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Contacto() {
  const { cart, totalPrice } = useCart();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
    productosExtra: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Formateamos la lista de productos
  const productosTexto =
    cart.length > 0
      ? cart
          .map((item) => `• ${item.nombre} (Cantidad: ${item.quantity})`)
          .join("\n") + `\n\nTotal estimado: $${totalPrice.toLocaleString()}`
      : form.productosExtra || "(No se seleccionaron productos del catálogo)";

  // 🟢 NUEVA FUNCIÓN DE ENVÍO CON NUESTRA API (Nodemailer)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) {
      alert("Por favor completa tu nombre y correo electrónico.");
      return;
    }

    setEnviando(true);

    // Unimos el asunto, el mensaje y los productos en un solo bloque de texto
    const cuerpoCorreo = `
      ASUNTO: ${form.asunto || `Nueva Cotización de ${form.nombre}`}

      MENSAJE DEL CLIENTE:
      ${form.mensaje ? form.mensaje : "(Sin mensaje adicional)"}
      
      ===================================
      
      PRODUCTOS DE INTERÉS:
      ${productosTexto}
    `;

    try {
      // Mandamos los datos a nuestra propia API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.email,
          mensaje: cuerpoCorreo,
        }),
      });

      if (res.ok) {
        setEnviado(true);
      } else {
        alert(
          "Hubo un problema al enviar el correo. Por favor, intenta de nuevo o contáctanos por WhatsApp.",
        );
      }
    } catch (error) {
      alert("Error de red. Verifica tu conexión a internet.");
    }

    setEnviando(false);
  };

  const waMessage = encodeURIComponent(
    `¡Hola, equipo de WOOX!\nMi nombre es ${form.nombre ? form.nombre : "..."}.\nMe gustaría obtener información sobre los siguientes productos:\n\n${productosTexto}${form.mensaje ? `\n\nNota adicional:\n${form.mensaje}` : ""}`,
  );

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-6 sm:px-8 bg-[#faf8ff] text-[#131b2e] w-full flex-1">
      {/* ── ENCABEZADO DE LA PÁGINA ── */}
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
        {/* ── FORMULARIO ── */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] relative overflow-hidden border border-[#bec9c2]/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#004532]/5 rounded-full -mr-16 -mt-16" />

          {enviado ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <CheckCircle
                size={64}
                strokeWidth={1.5}
                className="text-[#004532]"
              />
              <h3 className="text-3xl font-black text-[#131b2e] tracking-tight">
                ¡Solicitud Enviada!
              </h3>
              <p className="text-[#3f4944] text-base max-w-sm">
                Hemos recibido tu información correctamente. Un asesor se
                comunicará al correo <strong>{form.email}</strong> a la
                brevedad.
              </p>
              <button
                onClick={() => {
                  setEnviado(false);
                  setForm({
                    nombre: "",
                    email: "",
                    asunto: "",
                    mensaje: "",
                    productosExtra: "",
                  });
                }}
                className="mt-6 px-8 py-4 bg-white border-2 border-[#131b2e] text-[#131b2e] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#131b2e] hover:text-white transition-colors shadow-sm"
              >
                Enviar nueva solicitud
              </button>
            </div>
          ) : (
            <form
              className="space-y-6 relative z-10"
              onSubmit={handleEmailSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                    Nombre Completo *
                  </label>
                  <input
                    className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3"
                    placeholder="Ej. Alejandro Valdés"
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                    Email de Contacto *
                  </label>
                  <input
                    className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30
                     focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3"
                    placeholder="nombre@empresa.com"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                  Asunto
                </label>
                <input
                  className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none 
                  transition-all py-3 px-3"
                  placeholder="¿En qué podemos ayudarle?"
                  type="text"
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider block">
                  Mensaje Adicional
                </label>
                <textarea
                  className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 resize-none text-sm rounded-t-md"
                  placeholder="Describa requerimientos específicos, dudas o comentarios..."
                  rows={3}
                  value={form.mensaje}
                  onChange={(e) =>
                    setForm({ ...form, mensaje: e.target.value })
                  }
                />
              </div>

              {/* ── SECCIÓN DE PRODUCTOS EN EL CARRITO ── */}
              <div className="space-y-2 pt-2">
                <label className="text-[0.6875rem] font-bold text-[#3f4944] uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart size={16} className="text-[#004532]" />
                  Productos Solicitados
                </label>

                {cart.length > 0 ? (
                  <div className="bg-[#f2f3ff] border border-[#004532]/20 rounded-lg p-5 space-y-3 shadow-inner">
                    <p className="text-[10px] font-bold text-[#004532] uppercase tracking-widest mb-2">
                      Productos en tu carrito ({cart.length})
                    </p>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm border-b border-[#bec9c2]/20 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[#131b2e] font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#004532] rounded-full inline-block"></span>
                          {item.nombre}{" "}
                          <span className="text-[#3f4944] text-xs font-bold bg-white px-2 py-0.5 rounded-md ml-1 border border-[#bec9c2]/30">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-black text-[#131b2e]">
                          ${(item.precio * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-[#004532]/20 pt-3 mt-2 flex justify-between items-center font-black">
                      <span className="text-[10px] uppercase tracking-widest text-[#3f4944]">
                        Inversión Estimada
                      </span>
                      <span className="text-lg text-[#004532]">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="w-full bg-[#f2f3ff] border-0 border-b-2 border-[#bec9c2]/30 focus:border-[#004532] focus:ring-0 outline-none transition-all py-3 px-3 resize-none text-sm rounded-t-md"
                    placeholder="Tu carrito está vacío. Si buscas algún producto en específico, escríbelo aquí..."
                    rows={3}
                    value={form.productosExtra}
                    onChange={(e) =>
                      setForm({ ...form, productosExtra: e.target.value })
                    }
                  />
                )}
              </div>

              {/* ── BOTONES DE ENVÍO ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#bec9c2]/20">
                <a
                  href={`https://wa.me/525554946246?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold rounded-lg transition-all text-xs tracking-widest uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} strokeWidth={2} />
                  Vía WhatsApp
                </a>

                <button
                  type="submit"
                  disabled={enviando}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#131b2e] hover:bg-[#004532] text-white font-bold rounded-lg transition-all text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {enviando ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Mail size={18} />
                  )}
                  {enviando ? "Enviando..." : "Vía Correo"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── SIDEBAR CON INFORMACIÓN DE CONTACTO ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* ── REDES SOCIALES (NUEVO BLOQUE CON REACT-ICONS) ── */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#bec9c2]/20">
            <h4 className="text-[#004532] font-black text-xs uppercase tracking-[0.2em] mb-6">
              Síguenos en Redes
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1RFZuqigt8/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f2f3ff] text-[#131b2e] hover:bg-[#1877F2] hover:text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                title="Facebook"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/woox471?igsh=MXRsejZ2MTgwYmk3cg=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f2f3ff] text-[#131b2e] hover:bg-[#E1306C] hover:text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                title="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@woox084?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f2f3ff] text-[#131b2e] hover:bg-black hover:text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                title="TikTok"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl flex flex-col items-start hover:bg-[#f2f3ff] transition-all border border-[#bec9c2]/20 border-l-4 border-l-[#25D366] shadow-sm">
            <div className="bg-[#25D366]/10 p-3 rounded-lg mb-6 text-[#25D366]">
              <MessageCircle size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-2">WhatsApp Directo</h3>
            <p className="text-sm text-[#3f4944] mb-6 leading-relaxed">
              Respuesta inmediata para consultas rápidas y soporte técnico en
              vivo.
            </p>
            <a
              href="https://wa.me/525554946246"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center gap-2 font-bold text-[#25D366] group-hover:text-[#1ebd5a] group-hover:underline text-sm transition-colors"
            >
              Iniciar Chat
            </a>
          </div>

          <div className="bg-[#131b2e] text-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#004532]/20 rounded-full blur-3xl" />
            <h4 className="text-[#8bd6b6] font-black text-xs uppercase tracking-[0.2em] mb-8">
              Información de Contacto
            </h4>

            <ul className="space-y-6 relative z-10">
              <li>
                <a
                  href="tel:+525554946246"
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <Phone
                    size={20}
                    className="text-[#8bd6b6] group-hover:scale-110 transition-transform"
                  />
                  <div>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold mb-1 group-hover:text-slate-300 transition-colors">
                      Teléfono
                    </p>
                    <p className="text-sm font-medium group-hover:text-[#8bd6b6] transition-colors">
                      +52 55 5494 6246
                    </p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="mailto:wooxmexico@gmail.com"
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <Mail
                    size={20}
                    className="text-[#8bd6b6] group-hover:scale-110 transition-transform"
                  />
                  <div>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold mb-1 group-hover:text-slate-300 transition-colors">
                      Email
                    </p>
                    <p className="text-sm font-medium group-hover:text-[#8bd6b6] transition-colors">
                      wooxmexico@gmail.com
                    </p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-4">
                <Clock size={20} className="text-[#8bd6b6]" />
                <div>
                  <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest font-bold mb-1">
                    Horario
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    Lunes a Sábado
                    <br />
                    10:00 - 19:00 hrs
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    Domingo
                    <br />
                    11:00 - 19:00 hrs
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── UBICACIONES Y MAPA ── */}
      <div className="mt-20">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-[#bec9c2]/20 shadow-sm flex items-start gap-4">
            <MapPin size={32} className="text-[#004532]" strokeWidth={1.5} />
            <div>
              <h3 className="text-[#004532] font-black uppercase tracking-widest text-sm mb-2">
                Tienda Oficial
              </h3>
              <p className="text-[#3f4944] text-sm leading-relaxed">
                Eje Central Lázaro Cárdenas Puente Peredo s/n - Local C<br />
                Colonia Centro, Centro, Cuauhtémoc
                <br />
                06000 Ciudad de México, CDMX
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl overflow-hidden h-80 relative border border-[#bec9c2]/20 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60191.669012582846!2d-99.22353826236663!3d19.456458697679032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff0009cb660d%3A0x4fa98fa64cdfb021!2sWoox!5e0!3m2!1ses!2smx!4v1775331389976!5m2!1ses!2smx"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación WOOX"
          />
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="bg-[#004532] px-4 py-1 inline-block text-[0.6rem] font-black uppercase tracking-widest text-white rounded-sm shadow-md">
              Sede Principal CDMX
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
