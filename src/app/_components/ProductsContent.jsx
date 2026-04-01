"use client";
import FilterButton from "./FilterButton";
import { productos } from "@/app/_constants/data";
import ProductCard from "@/app/_components/ProductCard";
import { act, useState } from "react";
import { filters } from "../_constants/filters";
export default function ProductsContent() {
  const [activeFilters, setFilter] = useState({
    brand: null,
    cat: null,
    tipo: null,
  });

  if (activeFilters.tipo == "all") {
    setFilter({ brand: null, cat: null, tipo: null });
  }
  //
  const prodFiltered = productos.filter((el) => {
    // Si el filtro es null, pasa directo (true). Si tiene valor, debe coincidir.
    const matchBrand = activeFilters.brand
      ? el.marca === activeFilters.brand
      : true;
    const matchCat = activeFilters.cat
      ? el.categoria === activeFilters.cat
      : true;
    const matchTipo = activeFilters.tipo
      ? el.tipo === activeFilters.tipo
      : true;

    // Solo retorna el producto si cumple TODAS las condiciones activas
    return matchBrand && matchCat && matchTipo;
  });

  return (
    <>
      <section className="w-[90%] m-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3" id="barra-filtros">
          {filters.map((el, id) =>
            el.title === "SEP" ? (
              <div
                key={id}
                className="w-px h-8 bg-slate-300 mx-2 hidden sm:block"
              ></div>
            ) : (
              <FilterButton
                key={id}
                title={el.title}
                filterConfig={el} // Le pasas TODO el objeto: { title: "Piusi", brand: "PIUSI" }
                activeFilters={activeFilters} // Le pasas el estado general
                setFilter={setFilter}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              />
            ),
          )}
        </div>
      </section>
      <section className="w-[90%] m-auto">
        {prodFiltered.length < 1 ? (
          <div
            id="mensaje-sin-resultados"
            className=" text-center w-full py-10"
          >
            <p className="text-slate-500 text-lg">
              No se encontraron productos con ese filtro.
            </p>
            <button
              onClick={() => setFilter({ brand: null, cat: null, tipo: null })}
              className="mt-4 text-yellow-600 font-bold underline hover:text-yellow-700"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <p className="text-slate-500 text-lg mb-4">
            Productos encontrados: {prodFiltered.length}
          </p>
        )}
        <div
          id="contenedor-productos"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activeFilters.tipo == "all" ? (
            productos.map((el) => (
              <ProductCard key={el.id} producto={el} main={false} />
            ))
          ) : productos ? (
            prodFiltered.map((el) => (
              <ProductCard key={el.id} producto={el} main={false} />
            ))
          ) : (
            <p className="text-slate-400 animate-pulse">Cargando catálogo...</p>
          )}
        </div>
      </section>
    </>
  );
}
