"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppwriteProduct, account } from "../../lib/appwrite";
import { usePathname } from "next/navigation";

interface WishlistContextType {
  wishlistItems: AppwriteProduct[];
  addToWishlist: (product: AppwriteProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<AppwriteProduct[]>([]);
  const [userId, setUserId] = useState<string>("guest");
  const pathname = usePathname();

  // 1. Determine User ID on every route change
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

  // 2. Load wishlist specifically for this userId
  useEffect(() => {
    const key = `sabhe_wishlist_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wishlist", e);
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [userId]);

  // 3. Save wishlist to localStorage whenever it changes for this specific user
  useEffect(() => {
    const key = `sabhe_wishlist_${userId}`;
    localStorage.setItem(key, JSON.stringify(wishlistItems));
  }, [wishlistItems, userId]);

  const addToWishlist = (product: AppwriteProduct) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item.$id === product.$id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.$id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.$id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
