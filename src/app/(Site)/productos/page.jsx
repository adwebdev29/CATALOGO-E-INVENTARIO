import MainSec from "@/app/_components/MainSec";
import MainTitle from "@/app/_components/MainTitle";
import ProductsContent from "@/app/_components/ProductsContent";
import { supabase } from "@/app/_lib/supabase/supabase"; // Ajusta la ruta si pusiste la carpeta lib en otro lado

export const revalidate = 0; // Desactiva el caché para ver cambios al instante

export default async function Productos() {
  const { data, error } = await supabase.from("productos").select("*");

  // Adaptamos los nombres para no romper tu UI
  const productosAdaptados =
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
    <MainSec>
      <section className="w-[100%] m-auto mb-10 text-center pt-10">
        <MainTitle
          miniTitle="Catálogo Industrial"
          Title="Nuestros Equipos"
          desc=""
        />
      </section>

      {/* Inyectamos los datos de Supabase aquí */}
      <ProductsContent productos={productosAdaptados} />
    </MainSec>
  );
}
