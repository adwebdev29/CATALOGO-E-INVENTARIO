"use client";
import Link from "next/link";
import SliderButton from "./SliderButton";
import MainProductsList from "./MainProductsList";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
export default function MainProducts({ productosDestacados }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      // Ajustamos la cantidad de scroll para que avance una tarjeta a la vez aproximadamente
      const scrollAmount = direction === "right" ? 380 : -380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="px-8 py-24 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* CABECERA ARQUITECTÓNICA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#131b2e] uppercase mb-4">
            Productos Destacados
          </h2>
          <div className="w-24 h-1 bg-[#004532] mx-auto mb-6"></div>
          <p className="text-[#3f4944] max-w-2xl mx-auto text-lg leading-relaxed">
            La vanguardia tecnológica seleccionada bajo criterios de excelencia
            y arquitectura funcional.
          </p>
        </div>

        {/* CONTENEDOR DEL SLIDER CON BOTONES */}
        <div className="relative group">
          <MainProductsList ref={scrollRef} productos={productosDestacados} />

          {/* Botones de navegación del slider (Asegúrate de que tus SliderButton tengan position absolute) */}
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <SliderButton
              direction="left"
              setSlide={() => handleScroll("left")}
            />
            <SliderButton
              direction="right"
              setSlide={() => handleScroll("right")}
            />
          </div>
        </div>

        {/* BOTÓN INFERIOR */}
        <div className="text-center mt-16">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 border-2 border-[#004532] text-[#004532] px-10 py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#004532] hover:text-white transition-all rounded-lg"
          >
            Ver Catálogo Completo
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
