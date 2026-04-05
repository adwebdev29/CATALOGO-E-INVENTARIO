"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar el carrito desde localStorage al iniciar (Corregido para React 19)
  useEffect(() => {
    // 🟢 Envolverlo en un setTimeout asíncrono elimina el error de "cascading renders"
    const timer = setTimeout(() => {
      const savedCart = localStorage.getItem("woox_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error leyendo el carrito:", error);
        }
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("woox_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 3. Agregar al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // 4. Eliminar del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 5. Actualizar cantidad (+ / -)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // 6. Vaciar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // 7. Cambiar la variante de un producto que ya está en el carrito
  const changeItemVariant = (oldId, newVariantOption, fullProductData) => {
    setCart((prevCart) => {
      const newPrice =
        newVariantOption === 1
          ? fullProductData.precio
          : newVariantOption === 2
            ? fullProductData.precio_2
            : fullProductData.precio_3;
      const newTag =
        newVariantOption === 1
          ? fullProductData.etiqueta_1 || "1 Pieza"
          : newVariantOption === 2
            ? fullProductData.etiqueta_2
            : fullProductData.etiqueta_3;

      const baseId = oldId.toString().split("-")[0];
      const newId = `${baseId}-${newVariantOption}`;

      const existingItemIndex = prevCart.findIndex((item) => item.id === oldId);
      if (existingItemIndex === -1) return prevCart;

      const itemToUpdate = prevCart[existingItemIndex];
      const targetItemIndex = prevCart.findIndex((item) => item.id === newId);

      let newCart = [...prevCart];

      if (targetItemIndex !== -1 && targetItemIndex !== existingItemIndex) {
        newCart[targetItemIndex].quantity += itemToUpdate.quantity;
        newCart = newCart.filter((item) => item.id !== oldId);
      } else {
        const baseName = itemToUpdate.nombre.split("(")[0].trim();

        newCart[existingItemIndex] = {
          ...itemToUpdate,
          id: newId,
          nombre: `${baseName} (${newTag})`,
          precio: newPrice,
          varianteSeleccionada: newVariantOption,
        };
      }
      return newCart;
    });
  };

  // 8. Cálculos totales
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
        changeItemVariant,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
