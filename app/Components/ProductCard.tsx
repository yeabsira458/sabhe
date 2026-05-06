import React from "react";
import { FaShoppingCart } from "react-icons/fa";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-emerald-800 uppercase tracking-wider shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</span>
            <span className="text-2xl font-black text-emerald-800">
              {product.price.toLocaleString()} <span className="text-sm font-bold">ETB</span>
            </span>
          </div>
          <button 
            onClick={() => console.log(`Added ${product.title} to cart`)}
            className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-800/20 hover:shadow-emerald-800/40"
            title="Add to Cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}
