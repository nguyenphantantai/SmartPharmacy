import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@shared/schema";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, showNotification?: boolean) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "app_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product: Product, quantity: number = 1, showNotification: boolean = true) => {
    const newItem = { product, quantity };
    setItems((prev) => {
      const idx = prev.findIndex((i) => (i.product._id || i.product.id) === (product._id || product.id));
      if (idx >= 0) {
        // Product already in cart, just update quantity
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        if (showNotification) {
          setLastAddedItem({ product, quantity });
        }
        return next;
      }
      // New product being added - clear applied coupon
      localStorage.removeItem('applied_coupon');
      if (showNotification) {
        setLastAddedItem(newItem);
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => (i.product._id || i.product.id) !== productId));
  };

  const clear = () => setItems([]);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => 
      prev.map((item) => 
        (item.product._id || item.product.id) === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const value = useMemo<CartContextValue>(() => ({ 
    items, 
    addItem, 
    removeItem, 
    updateQuantity,
    clear, 
    lastAddedItem 
  }), [items, lastAddedItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


