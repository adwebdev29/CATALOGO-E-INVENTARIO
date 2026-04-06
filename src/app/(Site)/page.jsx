import Link from "next/link";
import { supabase } from "../_lib/supabase/supabase";
import MainProducts from "../_components/MainProducts";
// 🟢 Importamos iconos de Lucide para iterarlos en las categorías dinámicas
import { ArrowRight, Headphones, Laptop, Bot, Zap, Box } from "lucide-react";

export const revalidate = 0;

// Static featured products shown when DB is empty or as fallback UI
const STATIC_PRODUCTS = [
  {
    id: "s1",
    nombre: "Bomba de Aceite PRO",
    categoria: "Bombas",
    precio: 1450,
    etiqueta_1: "1 Pieza",
    precio_2: 1300,
    etiqueta_2: "Caja 10 Pzas",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVU3WncA2w4r3SH7RtbDoaoAn9Q-79gCiEg5v_C7uM7PlUWiwKTf-pONYEVvvn9dR9s4ROLaLiiEHbbhsS7ad-XiKPNrNhLrvJwwVqyDVDEuV26u2FClcKMCJkmWsE7qBqffLiNXdm-1KRUX4TxGdilxmJ6c8xXv9kqFo5DQqWjQauim7betgRGQGyGno5ZPXKWWJBYsglfPz97WGigzOzTBYyRs7d0Q_M_lLxsy_jS3s1dL_WWSgVylnz5eClm7HWYpAFXtnR7Ple",
    stock: 20,
  },
  {
    id: "s2",
    nombre: "Carrete Industrial 15m",
    categoria: "Carretes",
    precio: 2100,
    etiqueta_1: "Individual",
    precio_2: 1950,
    etiqueta_2: "Mayoreo (5+)",
    precio_3: 1800,
    etiqueta_3: "Distribuidor",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAM7P0TdPNW9jgTur9NmrITscnf1oiPFReVMppUjQEnu9pGPbEy59rcnEd0u-1SFnT-KHyYkJdS5iEbyprwlukBR4_URg2i8bGIUIANPCdPC4L9MU9dbQUlCa6Or5jig4cIakdA_0QG551Z9ypbT_jLQ2H0_VRUXVwLgGGi8aLco7EEfc0Ab_rBlmU58s34QuBwdlWx34BbpbBWrdkycUHo_-VXJJ09qeBAfzbn2TZqaWGgJRBFQiH1hMnUK75X3U8p1ie5iu_pYZoc",
    stock: 15,
  },
];

// 🟢 MAPA DE ESTILOS DINÁMICOS PARA LAS CATEGORÍAS
// Rotaremos entre estos estilos para las categorías que vengan de la base de datos
const CATEGORY_STYLES = [
  {
    bgClass: "bg-white border border-[#bec9c2]/10",
    titleClass: "text-[#131b2e]",
    subClass: "text-[#004532]",
    iconColor: "text-[#004532]",
    bgIconColor: "text-[#131b2e]",
    Icon: Headphones,
  },
  {
    bgClass: "bg-[#065f46]",
    titleClass: "text-white",
    subClass: "text-white/80",
    iconColor: "text-white",
    bgIconColor: "text-white",
    Icon: Laptop,
  },
  {
    bgClass: "bg-white border border-[#bec9c2]/10",
    titleClass: "text-[#131b2e]",
    subClass: "text-[#004532]",
    iconColor: "text-[#004532]",
    bgIconColor: "text-[#131b2e]",
    Icon: Bot,
  },
  {
    bgClass: "bg-[#131b2e]",
    titleClass: "text-white",
    subClass: "text-[#8bd6b6]",
    iconColor: "text-[#8bd6b6]",
    bgIconColor: "text-white",
    Icon: Zap,
  },
];

export default async function Home() {
  // 1. Fetch de productos destacados
  const { data: dataProductos } = await supabase
    .from("productos")
    .select("*")
    .eq("destacado", true);

  const productosDestacados =
    dataProductos?.map((p) => {
      const urlValida =
        p.imagen_url &&
        (p.imagen_url.startsWith("http") || p.imagen_url.startsWith("/"));
      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        descripcion: p.descripcion,
        precio: p.precio,
        imagen_url: urlValida
          ? p.imagen_url
          : "https://via.placeholder.com/300", // ← Cambiado a imagen_url
        etiqueta_1: p.etiqueta_1,
        etiqueta_2: p.etiqueta_2,
        precio_2: p.precio_2,
        etiqueta_3: p.etiqueta_3,
        precio_3: p.precio_3,
        stock: p.stock,
      };
    }) || [];

  const displayProducts =
    productosDestacados.length > 0 ? productosDestacados : STATIC_PRODUCTS;

  // 🟢 2. FETCH ESTRICTO DE CATEGORÍAS POPULARES
  // Solo traerá las que en BD tengan "popular = true"
  const { data: categoriasPopulares } = await supabase
    .from("categorias")
    .select("nombre")
    .eq("popular", true)
    .limit(6);

  const displayCategorias = categoriasPopulares || [];

  return (
    <main className="pt-16">
      {/* ── HERO (CON TUS IMÁGENES Y TEXTOS ORIGINALES) ── */}
      <section className="relative px-8 py-20 md:py-32 bg-white overflow-hidden border-b border-[#bec9c2]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 architectural-border pl-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004532] mb-4 block">
              Novedades 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#131b2e] mt-2 leading-[0.9] uppercase">
              Tecnología <br />
              <span className="text-[#004532]">a tu Alcance</span>
            </h1>
            <p className="text-lg text-[#3f4944] mt-8 max-w-md leading-relaxed">
              Tecnología que se integra contigo: accesorios funcionales, diseño
              limpio y rendimiento confiable.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/catalogo"
                className="bg-[#131b2e] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#004532] transition-all duration-300 text-xs tracking-widest uppercase"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-slate-100 overflow-hidden shadow-2xl">
              <img
                alt="Premium Tech"
                className="w-full h-full object-cover"
                src="https://rurbeszsrsahjotyjojn.supabase.co/storage/v1/object/public/productos/WOOX-AUDIFONOS-HERO.webp"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#004532] p-6 shadow-xl border border-white/10 max-w-[240px]">
              <p className="text-sm font-bold text-white">Woox Mx0052</p>
              <p className="text-[10px] text-white/70 mt-1 uppercase tracking-widest">
                Alta calidad en cada detalle
              </p>
            </div>
          </div>
        </div>

        {/* Vertical label */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="rotate-90 origin-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.4em] text-[#131b2e]/20">
            Editorial Collection — 2026
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (100% DINÁMICAS DESDE SUPABASE) ── */}
      <section className="px-8 py-24 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 architectural-border pl-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#131b2e] uppercase">
                Categorías <span className="text-[#004532]">Populares</span>
              </h2>
              <p className="text-sm text-[#3f4944] mt-2">
                Las categorías más buscadas por nuestros clientes.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-[#004532] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Ver todo
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 🟢 DIBUJAMOS SOLO LAS CATEGORÍAS QUE VIENEN DE LA BASE DE DATOS */}
          {displayCategorias.length === 0 ? (
            <p className="text-slate-500 text-sm font-medium">
              No hay categorías populares marcadas en la base de datos todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCategorias.map((cat, index) => {
                // Asignamos el estilo e ícono rotando sobre el arreglo CATEGORY_STYLES
                const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
                const IconComponent = style.Icon;

                return (
                  <Link
                    key={cat.nombre}
                    href={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                    className={`group relative ${style.bgClass} p-10 h-[320px] flex flex-col justify-end hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer overflow-hidden`}
                  >
                    <div
                      className={`absolute top-10 left-10 ${style.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent size={40} strokeWidth={1.5} />
                    </div>
                    <div className="z-10">
                      <h3
                        className={`text-2xl font-black ${style.titleClass} uppercase tracking-tight`}
                      >
                        {cat.nombre}
                      </h3>
                      <p
                        className={`text-[10px] font-bold ${style.subClass} uppercase tracking-widest mt-2`}
                      >
                        Explorar catálogo
                      </p>
                    </div>
                    <div
                      className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${style.bgIconColor}`}
                    >
                      <IconComponent size={180} strokeWidth={1} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS SLIDER ── */}
      <MainProducts productosDestacados={displayProducts} />

      <section className="px-8 py-32 bg-[#131b2e] text-white overflow-hidden relative border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 architectural-border pl-10 border-[#004532]">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">
              Más que <br />
              <span className="text-[#8bd6b6]">accesorios</span>
            </h2>

            <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-xl">
              En WOOX nos enfocamos en productos que te ayuden a ser más
              eficiente. Buena calidad, buen diseño y desempeño confiable en el
              día a día.
            </p>

            <div className="grid grid-cols-2 gap-12 mt-16">
              <div className="border-l border-white/10 pl-6">
                <p className="text-5xl font-black text-[#8bd6b6]">
                  Calidad real{" "}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]">
                  Productos hechos con los mejores materiales
                </p>
              </div>

              <div className="border-l border-white/10 pl-6">
                <p className="text-5xl font-black text-[#8bd6b6]">
                  Diseños increibles
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]"></p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 mt-10 border border-white/20 text-white px-8 py-3 font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-[#131b2e] transition-all">
              Explorar catálogo
              <ArrowRight size={16} />
            </button>
          </div>

          {/* IMAGEN */}
          <div className="flex-1 w-full h-[500px] bg-slate-900 overflow-hidden relative shadow-2xl">
            <img
              alt="Accesorios WOOX"
              className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3i-kpV4yrfyPUkZyx2hISD0NU4TW5Jwk7eIq12wvG3NUjMXLJ7QtYloOZj7xk4oH-08v6Wmcoy-yaVCRh78oX_-fgnYDU4WYTCCgEA1Xw5BqYu1gi5liBqrBwDlYOHaTw8RiVlwaxRrIa5nxOuwsBOQLAh2trlofEr4kKSglzyIOVg3A5Zv4Dr8-hYHStu7xsDCqwn1LyBfj41y7DTuWaRE-auc7GSJ6q4o5rvrKS3m6mcObqb4ChpzVbMPQAiu52w6UMqahINNvf"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="absolute left-8 bottom-32 rotate-180 [writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-white/5 pointer-events-none">
          Accesorios Móviles • Cables y Carga • Audio
        </div>
      </section>
    </main>
  );
}
