import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  /* Persist cart */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  /* =========================
     ADD TO CART
     ========================= */
  const addToCart = (product) => {
    const { id, selectedSize, quantity } = product;

    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === id &&
          item.selectedSize.ml === selectedSize.ml
      );

      if (existing) {
        return prev.map((item) =>
          item.id === id &&
          item.selectedSize.ml === selectedSize.ml
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, product];
    });
  };

  /* =========================
     REMOVE FROM CART
     ========================= */
  const removeFromCart = (productId, ml) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.selectedSize.ml === ml)
      )
    );
  };

  /* =========================
     UPDATE QUANTITY
     ========================= */
  const updateQuantity = (productId, ml, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, ml);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedSize.ml === ml
          ? { ...item, quantity }
          : item
      )
    );
  };

  /* =========================
     CLEAR CART
     ========================= */
  const clearCart = () => setItems([]);

  /* =========================
     TOTAL PRICE (SELLING)
     ========================= */
  const getTotal = () =>
    items.reduce(
      (total, item) =>
        total +
        item.selectedSize.sellingPrice * item.quantity,
      0
    );

  /* =========================
     TOTAL ITEMS
     ========================= */
  const getItemCount = () =>
    items.reduce((count, item) => count + item.quantity, 0);

  /* =========================
     CHECK IF IN CART
     ========================= */
  const isInCart = (productId, ml) =>
    items.some(
      (item) =>
        item.id === productId &&
        item.selectedSize.ml === ml
    );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
