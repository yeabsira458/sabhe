"use client";

import React from "react";
import { FaShoppingCart, FaStar, FaTag } from "react-icons/fa";

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discountedPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=600"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-emerald-800 uppercase tracking-wider shadow-sm">
          {product.category}
        </div>

        {/* Discount badge */}
        {product.discount && product.discount > 0 ? (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
            <FaTag size={9} />
            -{product.discount}%
          </div>
        ) : null}

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Rating */}
        {product.rating != null && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={12}
                className={star <= Math.round(product.rating!) ? "text-yellow-400" : "text-gray-200"}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</span>
            {discountedPrice ? (
              <div className="flex flex-col">
                <span className="text-2xl font-black text-emerald-800">
                  {Math.round(discountedPrice).toLocaleString()}{" "}
                  <span className="text-sm font-bold">ETB</span>
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString()} ETB
                </span>
              </div>
            ) : (
              <span className="text-2xl font-black text-emerald-800">
                {product.price.toLocaleString()} <span className="text-sm font-bold">ETB</span>
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.inStock === false}
            className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-800/20 hover:shadow-emerald-800/40 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}
