import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { cartService } from '../services';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const pendingSync = useRef(null);

  // Check if user is logged in
  const isLoggedIn = () => !!localStorage.getItem('token');

  // Get product ID (supports both _id and id)
  const getProductId = (product) => product._id || product.id;

  // Transform cart item for backend
  const transformForBackend = (item) => ({
    id: getProductId(item.product),
    name: item.product.name,
    price: item.selectedSize?.sellingPrice || item.product.salePrice || item.product.price,
    quantity: item.quantity,
    image: item.product.images?.[0] || item.product.image || '',
    weight: item.selectedSize?.ml ? `${item.selectedSize.ml}ml` : item.product.weight,
    selectedSize: item.selectedSize || null,
  });

  // Transform backend item to local format
  const transformFromBackend = (item) => ({
    product: {
      id: item.id,
      _id: item.id,
      name: item.name,
      price: item.price,
      salePrice: item.price,
      images: item.image ? [item.image] : [],
      weight: item.weight,
    },
    selectedSize: item.selectedSize,
    quantity: item.quantity,
  });

  // Initialize cart - load from localStorage first, then backend if logged in
  useEffect(() => {
    const initCart = async () => {
      // Load from localStorage first
      const saved = localStorage.getItem('cart');
      const localCart = saved ? JSON.parse(saved) : [];

      if (isLoggedIn()) {
        // If logged in, fetch from backend
        try {
          const response = await cartService.getCart();
          if (response.items && response.items.length > 0) {
            const backendItems = response.items.map(transformFromBackend);
            setItems(backendItems);
            localStorage.setItem('cart', JSON.stringify(backendItems));
          } else if (localCart.length > 0) {
            // If backend is empty but local has items, sync local to backend
            setItems(localCart);
            await saveToBackend(localCart);
          }
        } catch (error) {
          console.error('Failed to load cart from backend:', error);
          setItems(localCart);
        }
      } else {
        setItems(localCart);
      }
      setInitialized(true);
    };

    initCart();
  }, []);

  // Save to localStorage whenever items change (after initialization)
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, initialized]);

  // Save entire cart to backend (debounced)
  const saveToBackend = useCallback(async (cartItems) => {
    if (!isLoggedIn()) return;

    // Cancel pending sync
    if (pendingSync.current) {
      clearTimeout(pendingSync.current);
    }

    // Debounce by 500ms to avoid too many API calls
    pendingSync.current = setTimeout(async () => {
      try {
        setSyncing(true);
        const backendCart = cartItems.map(transformForBackend);
        await cartService.mergeCart(backendCart);
      } catch (error) {
        console.error('Failed to save cart to backend:', error);
      } finally {
        setSyncing(false);
      }
    }, 500);
  }, []);

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

      let newItems;
      if (existingIndex > -1) {
        newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
      } else {
        newItems = [...prev, {
          product: { ...product, id: productId, _id: productId },
          selectedSize: product.selectedSize,
          quantity,
        }];
      }

      // Sync to backend
      saveToBackend(newItems);
      return newItems;
    });
  }, [saveToBackend]);

  const removeFromCart = useCallback((productId, sizeML = null) => {
    setItems(prev => {
      const newItems = prev.filter(item => !itemMatches(item, productId, sizeML));
      saveToBackend(newItems);
      return newItems;
    });
  }, [saveToBackend]);

  const updateQuantity = useCallback((productId, quantity, sizeML = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeML);
      return;
    }

    setItems(prev => {
      const newItems = prev.map(item =>
        itemMatches(item, productId, sizeML)
          ? { ...item, quantity }
          : item
      );
      saveToBackend(newItems);
      return newItems;
    });
  }, [removeFromCart, saveToBackend]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (isLoggedIn()) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Failed to clear cart on backend:', error);
      }
    }
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

  // Sync cart with backend after login (merge guest cart)
  const syncWithBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || syncing) return;

    try {
      setSyncing(true);
      const guestCart = items.map(transformForBackend);
      const response = await cartService.mergeCart(guestCart);

      if (response.items) {
        const mergedItems = response.items.map(transformFromBackend);
        setItems(mergedItems);
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setSyncing(false);
    }
  }, [items, syncing]);

  // Load cart from backend (for page refresh when logged in)
  const loadFromBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await cartService.getCart();
      if (response.items && response.items.length > 0) {
        const backendItems = response.items.map(transformFromBackend);
        setItems(backendItems);
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
