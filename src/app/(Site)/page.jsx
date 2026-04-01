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

  // 2. Adaptamos el nombre de la imagen y metemos validación
  const productosDestacados =
    data?.map((p) => {
      // Verificamos si la imagen es válida (empieza con http o /)
      const urlValida =
        p.imagen_url &&
        (p.imagen_url.startsWith("http") || p.imagen_url.startsWith("/"));

      return {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        descripcion: p.descripcion,
        precio: p.precio,
        destacado: p.destacado,
        // Si no es válida (ej. "ads"), usamos el placeholder que ya permitimos en next.config
        imagen: urlValida ? p.imagen_url : "https://via.placeholder.com/300",
      };
    }) || [];

  return (
    <>
      <main className="w-full max-w-full mt-6">
        <Hero />
        <Distributors />
        {/* 3. Pasamos los datos ya filtrados y seguros como prop */}
        <MainProducts productosDestacados={productosDestacados} />
        <IntegralSolutions />
      </main>
    </>
  );
}
