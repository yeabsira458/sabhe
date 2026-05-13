"use client";

import React from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
  featured?: boolean;
  discount?: number;
  rating?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isFav = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFav) {
      removeFromWishlist(product.id);
    } else {
      // Map back to AppwriteProduct shape for context
      addToWishlist({
        $id: product.id,
        productName: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        featured: product.featured || false,
        inStock: product.inStock || true,
        discount: product.discount || 0,
        rating: product.rating || 5,
      } as any);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden bg-[#fafafa] transition-all duration-700 hover:shadow-2xl rounded-3xl border border-gray-100/50">
      
      {/* Wishlist Button (Floating) */}
      <button 
        onClick={toggleWishlist}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isFav ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500"}`}
      >
        {isFav ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
      </button>

      {/* Editorial Image Wrapper */}
      <Link href={`/Product/${product.id}`} className="relative aspect-[4/5] overflow-hidden block cursor-pointer">
        <img
          src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800&h=1000"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        
        {/* Minimal Overlay Labels (Behance Style) */}
        <div className="absolute top-6 left-6 flex flex-col gap-1 pr-14">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 drop-shadow-sm">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-white drop-shadow-md leading-tight">
            {product.title}
          </h3>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
      
      {/* Cart Button (Slides up on hover) */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-10 w-full px-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full flex items-center justify-center gap-3 bg-emerald-900/90 backdrop-blur-md px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl hover:bg-emerald-800 transition-all active:scale-95"
        >
          <FaShoppingCart size={12} />
          Add to Order
        </button>
      </div>

      {/* Info Below */}
      <div className="flex flex-col p-6 bg-white border-t border-gray-50 gap-2 flex-grow">
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ref. {product.id.slice(-6)}</span>
            {product.discount && product.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-800">
                  {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()} <span className="text-[10px] font-normal">ETB</span>
                </span>
                <span className="text-[10px] text-gray-400 line-through">{product.price.toLocaleString()} ETB</span>
              </div>
            ) : (
              <span className="text-sm font-black text-emerald-900">{product.price.toLocaleString()} ETB</span>
            )}
          </div>
          <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl">
             <FaShoppingCart size={14} className="opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
