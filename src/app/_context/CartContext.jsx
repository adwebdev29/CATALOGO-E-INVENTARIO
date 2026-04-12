"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../_lib/supabase/supabase";

const CartContext = createContext();

// 🟢 1. LA FUNCIÓN MÁGICA: Calcula el precio según la cantidad
const calcularPrecioMayoreo = (producto, cantidad) => {
  const min1 = producto.min_1 || 1;
  const min2 = producto.min_2 || Infinity; // Si es 0 o null, será Infinity
  const min3 = producto.min_3 || Infinity;

  if (cantidad >= min3 && producto.precio_3) {
    return {
      precioActual: producto.precio_3,
      etiquetaActual: producto.etiqueta_3,
    };
  } else if (cantidad >= min2 && producto.precio_2) {
    return {
      precioActual: producto.precio_2,
      etiquetaActual: producto.etiqueta_2,
    };
  } else {
    return {
      precioActual: producto.precio,
      etiquetaActual: producto.etiqueta_1 || "1 Pieza",
    };
  }
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mostrarPrecios, setMostrarPrecios] = useState(true);

  // FETCH CONFIGURACIÓN
  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const { data, error } = await supabase
          .from("configuracion_app")
          .select("mostrar_precios")
          .eq("id", 1)
          .single();
        if (error) throw error;
        if (data !== null) {
          setMostrarPrecios(data.mostrar_precios);
        }
      } catch (error) {
        console.error("Error al cargar la configuración de precios:", error);
      }
    };
    fetchConfiguracion();
  }, []);

  // 🟢 2. Cargar carrito (Forma correcta para Next.js sin setTimeout)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("woox_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error leyendo el carrito:", error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("woox_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 🟢 3. Agregar al carrito (Ahora recibe cantidadInicial)
  const addToCart = (product, cantidadInicial = 1) => {
    setCart((prevCart) => {
      // Ya no usamos el ID modificado con "-1", buscamos el ID real
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        const nuevaCantidad = existingItem.quantity + cantidadInicial;
        const { precioActual, etiquetaActual } = calcularPrecioMayoreo(
          product,
          nuevaCantidad,
        );

        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: nuevaCantidad,
                precio: precioActual,
                etiquetaActual,
              }
            : item,
        );
      }

      const { precioActual, etiquetaActual } = calcularPrecioMayoreo(
        product,
        cantidadInicial,
      );
      return [
        ...prevCart,
        {
          ...product,
          quantity: cantidadInicial,
          precio: precioActual,
          etiquetaActual,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 🟢 4. Actualizar cantidad (Recalcula el precio en cada click)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const { precioActual, etiquetaActual } = calcularPrecioMayoreo(
            item,
            newQuantity,
          );
          return {
            ...item,
            quantity: newQuantity,
            precio: precioActual,
            etiquetaActual,
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cálculos totales
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.precio * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        mostrarPrecios,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
