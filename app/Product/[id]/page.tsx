"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, AppwriteProduct } from "../../../lib/appwrite";
import { FaShoppingCart, FaArrowLeft, FaShieldAlt, FaTruck, FaRegHeart, FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Header from "../../Components/header";
import Footer from "../../Components/Footer";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<AppwriteProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const doc = await getProductById(id);
        setProduct(doc as AppwriteProduct);
      } catch (err) {
        console.error(err);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Product not found"}</h1>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-800 font-bold hover:underline"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const discountedPrice = product.discount && product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 text-xs font-bold uppercase tracking-widest"
        >
          <FaArrowLeft size={10} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Premium Image Gallery (Single for now) */}
          <div className="relative group">
            <div className="aspect-square bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 p-8 md:p-12 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.productName} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            
            {/* Overlay Details */}
            {product.discount && product.discount > 0 && (
              <div className="absolute top-8 left-8 bg-emerald-800 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Save {product.discount}%
              </div>
            )}
          </div>

          {/* Right: Editorial Product Details */}
          <div className="flex flex-col justify-center space-y-10">
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-emerald-800 text-xs font-bold uppercase tracking-[0.3em]">{product.category}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar size={10} />
                  <span className="text-gray-900 text-xs font-bold">{product.rating?.toFixed(1) || "5.0"}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter">
                {product.productName}
              </h1>
            </div>

            <div className="flex items-end gap-4 border-b border-gray-100 pb-10">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Investment</span>
                <div className="flex items-center gap-4">
                  <span className="text-3xl md:text-4xl font-black text-emerald-800">
                    {discountedPrice.toLocaleString()} <span className="text-sm font-normal">ETB</span>
                  </span>
                  {product.discount && product.discount > 0 && (
                    <span className="text-xl text-gray-300 line-through font-light">
                      {product.price.toLocaleString()} ETB
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {product.inStock ? "In Stock" : "Limited Availability"}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-500 leading-relaxed text-lg font-light italic">
                "{product.description || "No description available for this exquisite piece."}"
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl">
                    <FaShieldAlt size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">5-Year Warranty</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Guaranteed Quality</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl">
                    <FaTruck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Safe Delivery</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Addis Ababa & Regions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={() => addToCart(product)}
                className="flex-grow bg-emerald-800 hover:bg-emerald-700 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-800/20 active:scale-95"
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button className="w-20 bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-red-500 rounded-3xl flex items-center justify-center transition-all shadow-sm active:scale-95">
                <FaRegHeart size={24} />
              </button>
            </div>

            <div className="pt-10 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i + product.$id}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-800 shadow-sm">
                  +12
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recent interests in this item</p>
            </div>

          </div>
        </div>

      </main>

      {/* Recommended Section (Simplified placeholder) */}
      <section className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-tighter italic">Complementary Pieces</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="aspect-[4/5] bg-gray-50 rounded-3xl animate-pulse" />
            <div className="aspect-[4/5] bg-gray-50 rounded-3xl animate-pulse" />
            <div className="aspect-[4/5] bg-gray-50 rounded-3xl animate-pulse" />
            <div className="aspect-[4/5] bg-gray-50 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
