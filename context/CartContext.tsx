"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { calculateCartTotal } from "@/lib/utils/format";
import { useProducts } from "@/context/ProductContext";

const CART_STORAGE_KEY = "online-grocery-cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, isHydrated: productsHydrated } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setItems(loadCartFromStorage());
      setIsHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveCartToStorage(items);
  }, [isHydrated, items]);

  useEffect(() => {
    if (!isHydrated || !productsHydrated) return;

    const frame = window.requestAnimationFrame(() => {
      setItems((current) => {
        let changed = false;
        const next = current.flatMap((item) => {
          const product = products.find(
            (candidate) => candidate.id === item.product.id,
          );
          if (!product || product.stock <= 0) {
            changed = true;
            return [];
          }
          const quantity = Math.min(item.quantity, product.stock);
          if (product !== item.product || quantity !== item.quantity) {
            changed = true;
            return [{ product, quantity }];
          }
          return [item];
        });
        return changed ? next : current;
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isHydrated, productsHydrated, products]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0 || quantity <= 0) return;
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        const next = current.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );
        saveCartToStorage(next);
        return next;
      }

      const next = [
        ...current,
        { product, quantity: Math.min(quantity, product.stock) },
      ];
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.product.id !== productId);
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => {
        const next = current.filter((item) => item.product.id !== productId);
        saveCartToStorage(next);
        return next;
      });
      return;
    }

    setItems((current) => {
      const next = current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item,
      );
      saveCartToStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCartToStorage([]);
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: calculateCartTotal(items),
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isHydrated, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
