import { productos } from "../_constants/data";
import ProductCard from "./ProductCard";
import { forwardRef } from "react";
const MainProductsList = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="Principales"
      className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scroll-smooth scrollbar-none relative"
    >
      {productos.map((el) =>
        el.destacado == true ? <ProductCard key={el.id} producto={el} /> : null,
      )}
    </div>
  );
});

MainProductsList.displayName = "MainProductsList";

export default MainProductsList;
