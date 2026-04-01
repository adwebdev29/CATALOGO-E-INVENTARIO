// =========================================================
//  LÓGICA 1: PÁGINA DE PRODUCTOS (GRID + FILTROS COMBINADOS)
// =========================================================
const contenedorProductos = document.getElementById("contenedor-productos");
const mensajeSinResultados = document.getElementById("mensaje-sin-resultados");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

// ESTADO DE LOS FILTROS
let filtrosActivos = {
  brand: null,
  cat: null,
  tipo: null,
};

if (contenedorProductos) {
  // Función para renderizar
  function renderizarGrid(lista) {
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
      mensajeSinResultados.classList.remove("hidden");
    } else {
      mensajeSinResultados.classList.add("hidden");
    }

    lista.forEach((producto) => {
      // Colores por marca
      let brandColor = "bg-slate-200 text-slate-600";
      if (producto.marca === "PIUSI")
        brandColor = "bg-red-100 text-red-700 border border-red-200";
      if (producto.marca === "SAMSON")
        brandColor = "bg-blue-100 text-blue-700 border border-blue-200";
      if (producto.marca === "WINTEK")
        brandColor = "bg-green-100 text-green-700 border border-green-200";

      const card = `
                <article class="h-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
                    <div class="h-64 bg-white flex items-center justify-center p-6 relative overflow-hidden">
                        <span class="absolute top-4 left-4 ${brandColor} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide z-10">
                            ${producto.marca}
                        </span>
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" onerror="this.src='./src/assets/img/logo-milas-sin-fondo.webp'; this.classList.add('opacity-20');">
                    </div>
                    <div class="p-6 flex flex-col grow">
                        <div class="flex gap-2 mb-1">
                            <span class="text-xs text-yellow-600 font-bold uppercase tracking-wider">${producto.categoria}</span>
                            <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">• ${producto.tipo}</span>
                        </div>
                        <h3 class="font-poppins font-bold text-xl text-slate-800 mb-3 leading-tight">${producto.nombre}</h3>
                        <p class="text-slate-500 text-sm mb-6 sgrow leading-relaxed">${producto.descripcion}</p>
                        <a href="contacto.html?producto=${encodeURIComponent(producto.nombre)}" class="mt-auto block w-full py-3 text-center bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300">Cotizar Equipo</a>
                    </div>
                </article>
            `;
      contenedorProductos.innerHTML += card;
    });
  }

  // Función Principal de Filtrado
  function aplicarFiltros(filtroSeleccionado) {
    if (filtroSeleccionado === "all") {
      // Resetear todo
      filtrosActivos = { brand: null, cat: null, tipo: null };
    } else {
      const [clave, valor] = filtroSeleccionado.split(":");

      // Lógica Toggle: Si ya estaba activo, lo quitamos. Si no, lo ponemos.
      if (filtrosActivos[clave] === valor) {
        filtrosActivos[clave] = null; // Desactivar
      } else {
        filtrosActivos[clave] = valor; // Activar
      }
    }

    // Actualizar UI de botones
    actualizarBotonesUI();

    // Filtrar la lista de productos
    const productosFiltrados = productos.filter((p) => {
      // Cumple Marca? (Si es null, pasa. Si tiene valor, debe coincidir)
      const cumpleMarca = filtrosActivos.brand
        ? p.marca === filtrosActivos.brand
        : true;
      // Cumple Categoria?
      const cumpleCat = filtrosActivos.cat
        ? p.categoria === filtrosActivos.cat
        : true;
      // Cumple Tipo?
      const cumpleTipo = filtrosActivos.tipo
        ? p.tipo === filtrosActivos.tipo
        : true;

      return cumpleMarca && cumpleCat && cumpleTipo;
    });

    renderizarGrid(productosFiltrados);
  }

  function actualizarBotonesUI() {
    botonesFiltro.forEach((btn) => {
      const filtroBtn = btn.getAttribute("data-filter");

      // Reset visual
      btn.classList.remove("bg-slate-800", "text-white", "shadow-md");
      btn.classList.add("bg-white", "text-slate-600", "border-slate-200");

      // Si es el botón "Todos" y no hay filtros activos
      if (
        filtroBtn === "all" &&
        !filtrosActivos.brand &&
        !filtrosActivos.cat &&
        !filtrosActivos.tipo
      ) {
        btn.classList.remove("bg-white", "text-slate-600", "border-slate-200");
        btn.classList.add("bg-slate-800", "text-white", "shadow-md");
        return;
      }

      // Si es un botón activo
      if (filtroBtn !== "all") {
        const [clave, valor] = filtroBtn.split(":");
        if (filtrosActivos[clave] === valor) {
          btn.classList.remove(
            "bg-white",
            "text-slate-600",
            "border-slate-200",
          );
          btn.classList.add("bg-slate-800", "text-white", "shadow-md");
        }
      }
    });
  }

  // Inicialización
  document.addEventListener("DOMContentLoaded", () =>
    renderizarGrid(productos),
  );

  botonesFiltro.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const filtro = e.target.getAttribute("data-filter");
      aplicarFiltros(filtro);
    });
  });
}
