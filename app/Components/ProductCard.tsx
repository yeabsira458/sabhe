"use client";

import React from "react";
import { FaShoppingCart } from "react-icons/fa";

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

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden bg-[#fafafa] transition-all duration-700 hover:shadow-2xl">
      {/* Editorial Image Wrapper */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800&h=1000"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        
        {/* Minimal Overlay Labels (Behance Style) */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 drop-shadow-sm">
            {product.category}
          </span>
          <h3 className="text-lg font-light text-white drop-shadow-md">
            {product.title}
          </h3>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex items-center gap-3 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-xl hover:bg-black hover:text-white transition-colors"
          >
            <FaShoppingCart size={12} />
            Add to Order
          </button>
        </div>
      </div>

      {/* Info Below */}
      <div className="flex flex-col p-6 bg-white border-t border-gray-50 gap-2">
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ref. {product.id.slice(-6)}</span>
            {product.discount && product.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-800">
                  {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()} ETB
                </span>
                <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} ETB</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900">{product.price.toLocaleString()} ETB</span>
            )}
          </div>
          <div className="h-px w-8 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
