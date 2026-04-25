import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ApiCartItem,
  getCart, addToCart as apiAdd, updateCart as apiUpdate,
  removeFromCart as apiRemove, clearCart as apiClear,
} from "@/services/api";

interface CartContextType {
  items: ApiCartItem[];
  loading: boolean;
  addItem: (variety_id: number, quantity: number, delivery_type: "local" | "250km") => Promise<void>;
  removeItem: (variety_id: number) => Promise<void>;
  updateQuantity: (variety_id: number, quantity: number) => Promise<void>;
  updateDelivery: (variety_id: number, delivery_type: "local" | "250km") => Promise<void>;
  clearItems: () => Promise<void>;
  clearCart: () => Promise<void>; // alias for backward compat
  totalItems: number;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems]     = useState<ApiCartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!user) { setItems([]); return; }
    try {
      const res = await getCart();
      setItems(res.data);
    } catch {
      setItems([]);
    }
  }, [user]);

  // Load cart whenever user changes (login / logout)
  useEffect(() => { refetch(); }, [refetch]);

  const addItem = useCallback(async (variety_id: number, quantity: number, delivery_type: "local" | "250km") => {
    setLoading(true);
    try {
      const res = await apiAdd(variety_id, quantity, delivery_type);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (variety_id: number) => {
    setLoading(true);
    try {
      const res = await apiRemove(variety_id);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (variety_id: number, quantity: number) => {
    setLoading(true);
    try {
      const res = await apiUpdate(variety_id, { quantity });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDelivery = useCallback(async (variety_id: number, delivery_type: "local" | "250km") => {
    setLoading(true);
    try {
      const res = await apiUpdate(variety_id, { delivery_type });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearItems = useCallback(async () => {
    setLoading(true);
    try {
      await apiClear();
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading,
      addItem, removeItem, updateQuantity, updateDelivery,
      clearItems,
      clearCart: clearItems,
      totalItems, refetch,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
