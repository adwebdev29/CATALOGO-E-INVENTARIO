import MainSec from "@/app/_components/MainSec";
import MainTitle from "@/app/_components/MainTitle";
import ProductsContent from "@/app/_components/ProductsContent";
export default function Productos() {
  return (
    <MainSec>
      <section className="w-[100%] m-auto mb-10 text-center pt-10">
        <MainTitle
          miniTitle=" Catálogo Industrial"
          Title="Nuestros Equipos"
          desc=""
        />
      </section>

      <ProductsContent />
    </MainSec>
  );
}
