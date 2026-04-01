"use client";
import Link from "next/link";
import SliderButton from "./SliderButton";
import H2 from "./H2";
import MainProductsList from "./MainProductsList";
import { useRef } from "react";
export default function MainProducts() {
  const scrollRef = useRef(null);
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      // 350px es un buen promedio para mover una tarjeta + gap
      const scrollAmount = direction === "right" ? 350 : -350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-[90%] m-auto py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="px-2">
          <H2>Productos Destacados</H2>
        </div>
        <Link
          href="/productos"
          className="hidden md:block text-yellow-600 font-semibold hover:underline"
        >
          Ver catálogo completo →
        </Link>
      </div>

      <MainProductsList ref={scrollRef} />
      <div className="md:hidden text-center mt-4">
        <Link
          href="/productos"
          className="text-yellow-600 font-semibold text-sm hover:underline"
        >
          Ver todos los productos →
        </Link>
      </div>
      <SliderButton direction="right" setSlide={() => handleScroll("right")} />
      <SliderButton setSlide={() => handleScroll("left")} />
    </section>
  );
}
