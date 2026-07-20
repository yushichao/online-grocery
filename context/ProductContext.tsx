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
import { products as fallbackProducts } from "@/lib/data/products";
import type { Product } from "@/lib/types";

interface ProductContextValue {
  products: Product[];
  isHydrated: boolean;
  refreshProducts: () => Promise<void>;
  getProduct: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      if (!response.ok) throw new Error("商品加载失败");
      setProducts((await response.json()) as Product[]);
    } catch {
      // Keep the bundled catalog available if the database is temporarily offline.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshProducts]);

  const getProduct = useCallback(
    (productId: string) => products.find((product) => product.id === productId),
    [products],
  );

  const value = useMemo<ProductContextValue>(
    () => ({ products, isHydrated, refreshProducts, getProduct }),
    [products, isHydrated, refreshProducts, getProduct],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
