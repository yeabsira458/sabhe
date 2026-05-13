"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, AppwriteProduct } from "../../../lib/appwrite";
import { FaShoppingCart, FaArrowLeft, FaShieldAlt, FaTruck, FaHeart, FaRegHeart, FaStar, FaExpandAlt } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Header from "../../Components/header";
import Footer from "../../Components/Footer";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<AppwriteProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [cleanDescription, setCleanDescription] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const doc = await getProductById(id);
        const prod = doc as AppwriteProduct;
        setProduct(prod);
        
        if (prod?.image) setSelectedImage(prod.image);

        // Parse gallery from description if hidden metadata exists
        let finalGallery: string[] = [];
        let finalDesc = prod.description || "";

        if (finalDesc.includes("<!--GALLERY:")) {
          const parts = finalDesc.split("<!--GALLERY:");
          finalDesc = parts[0].trim();
          const galleryStr = parts[1].split("-->")[0];
          try {
            finalGallery = JSON.parse(galleryStr);
          } catch (e) {
            console.error("Failed to parse gallery metadata", e);
          }
        }
        
        setGallery(finalGallery);
        setCleanDescription(finalDesc);

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

  const isFav = isInWishlist(product.$id);
  const discountedPrice = product.discount && product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  const allImages = [product.image, ...gallery];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-32 pb-24">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-12 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <FaArrowLeft size={10} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            
            {allImages.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0 scrollbar-hide max-h-[600px]">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? "border-emerald-800 scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className={`flex-grow relative group ${allImages.length === 1 ? "md:ml-0" : ""}`}>
              <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100/50 p-8 flex items-center justify-center relative">
                <img 
                  key={selectedImage}
                  src={selectedImage} 
                  alt={product.productName} 
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-700 animate-in fade-in zoom-in-95"
                />
                
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in">
                   <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl text-emerald-900 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <FaExpandAlt size={20} />
                   </div>
                </div>
              </div>
              
              {product.discount && product.discount > 0 && (
                <div className="absolute top-8 left-8 bg-emerald-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl z-10">
                  Exclusive -{product.discount}%
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar size={10} />
                    <span className="text-gray-900 text-xs font-bold">{product.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                </div>
                <button 
                  onClick={() => isFav ? removeFromWishlist(product.$id) : addToWishlist(product)}
                  className={`p-3 rounded-full transition-all duration-300 ${isFav ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-400"}`}
                >
                  {isFav ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                </button>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter italic">
                {product.productName.split(' ')[0]}<br/>
                <span className="text-emerald-800 not-italic">{product.productName.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            <div className="space-y-12 mb-12">
              <div className="flex items-end gap-6 border-b border-gray-100 pb-12">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-3">Investment Value</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black text-emerald-900">
                      {discountedPrice.toLocaleString()} <span className="text-sm font-normal italic">ETB</span>
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xl text-gray-300 line-through font-light">
                        {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {product.inStock ? "Available Now" : "Pre-Order Only"}
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-gray-500 leading-relaxed text-xl font-light italic border-l-4 border-emerald-100 pl-6 py-2">
                  "{cleanDescription || "A masterfully crafted piece for your home."}"
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl">
                      <FaShieldAlt size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">5-Year Warranty</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Guaranteed Quality</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl">
                      <FaTruck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Safe Delivery</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Addis & Regions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(product)}
                className="flex-[3] bg-emerald-900 hover:bg-emerald-800 text-white py-7 rounded-3xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 group"
              >
                <FaShoppingCart className="group-hover:translate-x-1 transition-transform" />
                Reserve Piece
              </button>
              <button 
                onClick={() => isFav ? removeFromWishlist(product.$id) : addToWishlist(product)}
                className={`flex-1 py-7 rounded-3xl flex items-center justify-center transition-all shadow-sm active:scale-95 border border-gray-100 ${isFav ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
              >
                {isFav ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
