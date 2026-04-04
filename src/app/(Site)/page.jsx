import Link from "next/link";
import { supabase } from "../_lib/supabase/supabase";
import MainProducts from "../_components/MainProducts";

export const revalidate = 0;

// Static featured products shown when DB is empty or as fallback UI
const STATIC_PRODUCTS = [
  {
    id: "s1",
    nombre: "Teclado Mecánico V2",
    categoria: "Keychron",
    precio: 149,
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVU3WncA2w4r3SH7RtbDoaoAn9Q-79gCiEg5v_C7uM7PlUWiwKTf-pONYEVvvn9dR9s4ROLaLiiEHbbhsS7ad-XiKPNrNhLrvJwwVqyDVDEuV26u2FClcKMCJkmWsE7qBqffLiNXdm-1KRUX4TxGdilxmJ6c8xXv9kqFo5DQqWjQauim7betgRGQGyGno5ZPXKWWJBYsglfPz97WGigzOzTBYyRs7d0Q_M_lLxsy_jS3s1dL_WWSgVylnz5eClm7HWYpAFXtnR7Ple",
  },
  {
    id: "s2",
    nombre: "MacBook Air M3",
    categoria: "Apple",
    precio: 1099,
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAM7P0TdPNW9jgTur9NmrITscnf1oiPFReVMppUjQEnu9pGPbEy59rcnEd0u-1SFnT-KHyYkJdS5iEbyprwlukBR4_URg2i8bGIUIANPCdPC4L9MU9dbQUlCa6Or5jig4cIakdA_0QG551Z9ypbT_jLQ2H0_VRUXVwLgGGi8aLco7EEfc0Ab_rBlmU58s34QuBwdlWx34BbpbBWrdkycUHo_-VXJJ09qeBAfzbn2TZqaWGgJRBFQiH1hMnUK75X3U8p1ie5iu_pYZoc",
  },
  {
    id: "s3",
    nombre: "Galaxy Watch 6",
    categoria: "Samsung",
    precio: 299,
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMXQkUe5JemSJ2jNXxJaepZHZndrGfozbTibeFi3zqAq6Akr1qElqeoqsu3miTzXIVgt8xbwAQixYn5jX9bgJ3ew5HCCYt3DTBQq_DRppTksEr2cy7pGwS3C8Qtn09BZIBAjYVNA2p7YclMTk5a2vPvhfP_2W-MISg8wX44mL4kal1kP8b2GCE2mM1MCueX4IpDIGOFnlKYQaP5GNclsScdlTKtxOvUqtAikMpRbw2xBCTX284q5I0Ig8G68UNv5n3Y5Emv3vCmWv",
  },
  {
    id: "s4",
    nombre: "Funda de Cuero Pro",
    categoria: "Nomad",
    precio: 45,
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVYWI03VHCfPqzTSuY548_TiQm1trPd5ZAuYL84BFiiiJwk8-uwAnAUBQ0MqiCmsTdow1v4xk-OhQIYEqfOMkmMdxY1HW9248bNIVIypvODC1yETmyQKF1v6CLItL_gYDT_D12R9AfHETLwq9to9QA8B46Z0dbxoB-UVQ_L-p4exnggBJ5Lh2N5RCBAbUnu37oAgfa5azSWlUFpr6jCsJztZwIavZ9L3mm1GGUrMhk8GScgfHNIuR4QyHi6ZqRETko_zk4KZg39dNk",
  },
];

export default async function Home() {
  // Fetch featured products from Supabase
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("destacado", true);

  const productosDestacados =
    data?.map((p) => {
      const urlValida =
        p.imagen_url &&
        (p.imagen_url.startsWith("http") || p.imagen_url.startsWith("/"));
      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        descripcion: p.descripcion,
        precio: p.precio,
        imagen: urlValida ? p.imagen_url : "https://via.placeholder.com/300",
      };
    }) || [];

  // Use DB products if available, else static placeholders
  const displayProducts =
    productosDestacados.length > 0 ? productosDestacados : STATIC_PRODUCTS;

  return (
    <main className="pt-16">
      {/* ── HERO ── */}
      <section className="relative px-8 py-20 md:py-32 bg-white overflow-hidden border-b border-[#bec9c2]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 architectural-border pl-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004532] mb-4 block">
              New Arrival 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#131b2e] mt-2 leading-[0.9] uppercase">
              Tecnología <br />
              <span className="text-[#004532]">a tu Alcance</span>
            </h1>
            <p className="text-lg text-[#3f4944] mt-8 max-w-md leading-relaxed">
              Curamos la mejor selección de hardware y accesorios de alta gama
              para elevar tu estilo de vida digital con precisión
              arquitectónica.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/catalogo"
                className="bg-[#131b2e] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#004532] transition-all duration-300 text-xs tracking-widest uppercase"
              >
                Explorar Catálogo
              </Link>
              <button className="flex items-center gap-2 bg-[#f2f3ff] text-[#131b2e] px-10 py-4 rounded-lg font-bold hover:bg-[#dae2fd] transition-all text-xs tracking-widest uppercase">
                Ver Gadgets
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-slate-100 overflow-hidden shadow-2xl">
              <img
                alt="Premium Tech"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnZAabGpcFWz-xIOGeUsAJnoZSFa3UyXRpwaayZVRIeBSe5o8WEOqDbQPohCWfycUjTrndT_-6rr9nPVmizWNfOiA3KreaEx3rOVSdt0cT8XAM-usoZT-MKWvLQB4_OQNIkEhFOh05xXUJrM-g6bbdCJYn9xT81Qajlt40GNFdHUHAh7Dy--2MN-BN_E2arLb_j1ilSrLjybLs7aYuB3GXjAaDRNWQI1bTuGYeB3M127CC4V95UOT95u6V36dGJEaYpMVbJAA5yDqa"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#004532] p-6 shadow-xl border border-white/10 max-w-[240px]">
              <p className="text-sm font-bold text-white">
                Ultra Noise Canceling
              </p>
              <p className="text-[10px] text-white/70 mt-1 uppercase tracking-widest">
                Disponible en Accesorios
              </p>
            </div>
          </div>
        </div>

        {/* Vertical label */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="rotate-90 origin-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.4em] text-[#131b2e]/20">
            Editorial Collection — 2024
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="px-8 py-24 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 architectural-border pl-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#131b2e] uppercase">
                Categorías <span className="text-[#004532]">Populares</span>
              </h2>
              <p className="text-sm text-[#3f4944] mt-2">
                Navega por nuestra selección curada.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="text-[#004532] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Ver todo
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontSize: "16px" }}
              >
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-white border border-[#bec9c2]/10 p-10 h-[320px] flex flex-col justify-end hover:shadow-xl transition-all duration-300">
              <div className="absolute top-10 left-10 text-[#004532] group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "40px" }}
                >
                  headphones
                </span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-black text-[#131b2e] uppercase tracking-tight">
                  Accessories
                </h3>
                <p className="text-[10px] font-bold text-[#004532] uppercase tracking-widest mt-2">
                  Personaliza tu espacio
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "180px" }}
                >
                  headphones
                </span>
              </div>
            </div>

            {/* Card 2 - Primary */}
            <div className="group relative bg-[#065f46] p-10 h-[320px] flex flex-col justify-end hover:shadow-xl transition-all duration-300">
              <div className="absolute top-10 left-10 text-white group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "40px" }}
                >
                  laptop_mac
                </span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Computers
                </h3>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-2">
                  Poder sin límites
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "180px" }}
                >
                  laptop_mac
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white border border-[#bec9c2]/10 p-10 h-[320px] flex flex-col justify-end hover:shadow-xl transition-all duration-300">
              <div className="absolute top-10 left-10 text-[#004532] group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "40px" }}
                >
                  smart_toy
                </span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-black text-[#131b2e] uppercase tracking-tight">
                  Gadgets
                </h3>
                <p className="text-[10px] font-bold text-[#004532] uppercase tracking-widest mt-2">
                  Futuro en tus manos
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "180px" }}
                >
                  smart_toy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS SLIDER ── */}
      <MainProducts productosDestacados={displayProducts} />

      {/* ── ABOUT ── */}
      <section className="px-8 py-32 bg-[#131b2e] text-white overflow-hidden relative border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 architectural-border pl-10 border-[#004532]">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">
              Sobre <br />
              <span className="text-[#8bd6b6]">Woox</span>
            </h2>
            <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-xl">
              Nacimos con la visión de simplificar el acceso a lo último en
              tecnología global mediante una curaduría basada en la excelencia
              arquitectónica y el desempeño profesional.
            </p>
            <div className="grid grid-cols-2 gap-12 mt-16">
              <div className="border-l border-white/10 pl-6">
                <p className="text-5xl font-black text-[#8bd6b6]">10k+</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]">
                  Productos Entregados
                </p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <p className="text-5xl font-black text-[#8bd6b6]">24/7</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]">
                  Soporte Especializado
                </p>
              </div>
            </div>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 mt-10 border border-white/20 text-white px-8 py-3 font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-[#131b2e] transition-all"
            >
              Conoce más
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="flex-1 w-full h-[500px] bg-slate-900 overflow-hidden relative shadow-2xl">
            <img
              alt="Tech Workshop"
              className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3i-kpV4yrfyPUkZyx2hISD0NU4TW5Jwk7eIq12wvG3NUjMXLJ7QtYloOZj7xk4oH-08v6Wmcoy-yaVCRh78oX_-fgnYDU4WYTCCgEA1Xw5BqYu1gi5liBqrBwDlYOHaTw8RiVlwaxRrIa5nxOuwsBOQLAh2trlofEr4kKSglzyIOVg3A5Zv4Dr8-hYHStu7xsDCqwn1LyBfj41y7DTuWaRE-auc7GSJ6q4o5rvrKS3m6mcObqb4ChpzVbMPQAiu52w6UMqahINNvf"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="absolute left-8 bottom-32 rotate-180 [writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.5em] text-white/5 pointer-events-none">
          Architectural Precision • Superior Curation
        </div>
      </section>
    </main>
  );
}
