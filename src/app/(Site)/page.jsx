import Distributors from "../_components/Distributors";
import Hero from "../_components/Hero";
import MainProducts from "../_components/MainProducts";
import IntegralSolutions from "../_components/IntegralSolutions";
export default function Home() {
  return (
    <>
      <main className="w-full max-w-full mt-6">
        <Hero />
        <Distributors />
        <MainProducts />
        <IntegralSolutions />
      </main>
    </>
  );
}
