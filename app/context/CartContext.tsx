"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { account } from "@/lib/appwrite";
import { usePathname } from "next/navigation";

export interface CartItem {
  id: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string>("guest");
  const pathname = usePathname();

  // 1. Determine User ID on every route change (to catch login/logout)
  useEffect(() => {
    async function getUserId() {
      try {
        const u = await account.get();
        if (u.$id !== userId) {
          setUserId(u.$id);
        }
      } catch {
        if (userId !== "guest") {
          setUserId("guest");
        }
      }
    }
    getUserId();
  }, [pathname, userId]);

  // 2. Load cart specifically for this userId
  useEffect(() => {
    const key = `sabhe_cart_${userId}`;
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [userId]);

  // 3. Save cart to localStorage whenever it changes for this specific user
  useEffect(() => {
    const key = `sabhe_cart_${userId}`;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = useCallback((product: any) => {
    setCart((prev) => {
      const pId = product.id || product.$id;
      const existing = prev.find((item) => item.id === pId);
      if (existing) {
        return prev.map((item) =>
          item.id === pId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: pId,
          productName: product.productName || product.title || "Unknown Product",
          price: product.price || 0,
          image: product.image || "",
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
