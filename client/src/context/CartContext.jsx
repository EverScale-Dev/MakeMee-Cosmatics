import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [syncing, setSyncing] = useState(false);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Get product ID (supports both _id and id)
  const getProductId = (product) => product._id || product.id;

  // Check if item matches (by productId AND size)
  const itemMatches = (item, productId, sizeML) => {
    const itemProductId = getProductId(item.product);
    const sameProduct = itemProductId === productId;
    const sameSize = (!item.selectedSize && !sizeML) ||
      (item.selectedSize?.ml === sizeML);
    return sameProduct && sameSize;
  };

  const addToCart = useCallback((product, quantity = 1) => {
    const productId = getProductId(product);
    const sizeML = product.selectedSize?.ml;

    setItems(prev => {
      const existingIndex = prev.findIndex(item =>
        itemMatches(item, productId, sizeML)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, {
        product: { ...product, id: productId },
        selectedSize: product.selectedSize,
        quantity,
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId, sizeML = null) => {
    setItems(prev => prev.filter(item => !itemMatches(item, productId, sizeML)));
  }, []);

  const updateQuantity = useCallback((productId, quantity, sizeML = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeML);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        itemMatches(item, productId, sizeML)
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.selectedSize?.sellingPrice ||
        item.product.salePrice ||
        item.product.price ||
        0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((productId, sizeML = null) => {
    return items.some(item => itemMatches(item, productId, sizeML));
  }, [items]);

  // Sync cart with backend after login
  const syncWithBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || syncing) return;

    try {
      setSyncing(true);

      // Prepare guest cart for merge
      const guestCart = items.map(item => ({
        id: getProductId(item.product),
        name: item.product.name,
        price: item.selectedSize?.sellingPrice || item.product.salePrice || item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
        weight: item.selectedSize?.ml ? `${item.selectedSize.ml}ml` : item.product.weight,
        selectedSize: item.selectedSize || null,
      }));

      // Merge with backend cart
      const response = await cartService.mergeCart(guestCart);

      // Update local state with merged cart
      if (response.items) {
        setItems(response.items.map(item => ({
          product: {
            id: item.id,
            _id: item.id,
            name: item.name,
            price: item.price,
            images: [item.image],
            weight: item.weight,
          },
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })));
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setSyncing(false);
    }
  }, [items, syncing]);

  // Load cart from backend
  const loadFromBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await cartService.getCart();
      if (response.items && response.items.length > 0) {
        setItems(response.items.map(item => ({
          product: {
            id: item.id,
            _id: item.id,
            name: item.name,
            price: item.price,
            images: [item.image],
            weight: item.weight,
          },
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

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
        syncWithBackend,
        loadFromBackend,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
