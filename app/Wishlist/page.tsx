"use client";

import React from "react";
import Link from "next/link";
import { FaRegHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <Link href="/Collections" className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase tracking-widest hover:underline mb-4">
              <FaArrowLeft size={10} /> Back to Shopping
            </Link>
            <h1 className="text-6xl font-black text-gray-900 leading-none">
              My <span className="text-emerald-800 italic">Wishlist</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-md">
              A curated collection of your favorite artisanal furniture pieces. Save them here until you're ready to make them yours.
            </p>
          </div>
          <div className="bg-white px-8 py-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saved Items</span>
              <span className="text-4xl font-black text-emerald-900">{wishlistCount}</span>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
               <FaRegHeart size={20} />
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.$id} className="relative group">
                {/* Wrap in a helper to match ProductCard props */}
                <ProductCard 
                  product={{
                    id: item.$id,
                    title: item.productName,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    discount: item.discount,
                    rating: item.rating
                  }} 
                />
                
                {/* Remove button (Floating extra for wishlist page) */}
                <button 
                  onClick={() => removeFromWishlist(item.$id)}
                  className="absolute bottom-24 right-4 z-30 w-10 h-10 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 border border-gray-100"
                  title="Remove from wishlist"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-gray-100 max-w-3xl mx-auto">
            <div className="text-7xl mb-8 grayscale opacity-20">🛋️</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
              Explore our unique collections and tap the heart icon on pieces that inspire you.
            </p>
            <Link 
              href="/Collections" 
              className="inline-block bg-emerald-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
            >
              Start Exploring
            </Link>
          </div>
        )}

      </div>
      
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}
