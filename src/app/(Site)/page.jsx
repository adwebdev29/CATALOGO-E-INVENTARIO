import Distributors from "../_components/Distributors";
import Hero from "../_components/Hero";
import MainProducts from "../_components/MainProducts";
import IntegralSolutions from "../_components/IntegralSolutions";
import { supabase } from "@/app/_lib/supabase/supabase"; // Ajusta la ruta a tu supabase.js

export const revalidate = 0; // Desactiva caché para datos frescos

export default async function Home() {
  // 1. Fetch de Supabase filtrando SOLO los destacados
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("destacado", true);

  // 2. Adaptamos el nombre de la imagen para tu UI
  const productosDestacados =
    data?.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      descripcion: p.descripcion,
      precio: p.precio,
      destacado: p.destacado,
      imagen: p.imagen_url,
    })) || [];

  return (
    <>
      <main className="w-full max-w-full mt-6">
        <Hero />
        <Distributors />
        {/* 3. Pasamos los datos como prop */}
        <MainProducts productosDestacados={productosDestacados} />
        <IntegralSolutions />
      </main>
    </>
  );
}
