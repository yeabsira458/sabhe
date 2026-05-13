"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "../../lib/appwrite";
import { FaShieldAlt, FaBalanceScale, FaClock, FaPencilRuler, FaGem } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function Graphics() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // ── 1. Constants for easy editing ──────────────────────────────────────────
  const BADGES = [
    { icon: <FaShieldAlt />,  label: "5-Year\nWarranty" },
    { icon: <FaBalanceScale />, label: "Fair\nPricing" },
    { icon: <FaClock />,     label: "On-Time\nExecution" },
    { icon: <FaPencilRuler />, label: "Custom\nDesigns" },
    { icon: <FaGem />,       label: "Premium\nMaterials" },
  ];

  useEffect(() => {
    async function fetchGraphics() {
      try {
        const allProducts = await getProducts();
        const withImages = allProducts.filter((p: any) => p.image);
        if (withImages.length > 0) {
          setProducts(withImages);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchGraphics();
  }, []);

  const currentProduct = products[currentIndex];

  // Auto-rotate the image every 1 hour (3600000ms)
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3600000); 
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;

  return (
    <section className="bg-white font-sans">
      <div className="w-full">
        
        {/* Dynamic Graphic Poster - Full Width & Square (4:4) */}
        <div className="relative w-full aspect-square overflow-hidden shadow-2xl group">
          
          {/* Background Image (Original Product Image) */}
          <img 
            key={currentProduct.$id}
            src={currentProduct.image} 
            alt={currentProduct.productName}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 animate-in fade-in zoom-in-105"
          />

          {/* Dark Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          {/* Top Left Logo Area */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
            <h2 className="text-xl font-black text-white tracking-tight">SABHE <span className="text-emerald-400">FURNITURE</span></h2>
            <p className="text-[9px] text-white/80 tracking-[0.3em] uppercase mt-1">Redefining Spaces</p>
          </div>

          {/* Main Typography */}
          <div className="absolute top-1/4 left-8 md:left-12 z-20 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-light text-white leading-tight font-serif italic">
              Experience
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">
              The Pure
            </h2>
            <h3 className="text-5xl md:text-7xl font-black mt-2 uppercase tracking-tighter drop-shadow-lg text-emerald-400">
              {currentProduct.category || "DESIGN"}
            </h3>
            
            {/* Dynamic Product Name */}
            <div className="mt-8 flex flex-col gap-2 items-start">
              <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md pl-4 pr-6 py-2 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-white text-sm font-bold tracking-wider">Product: <span className="text-emerald-300">{currentProduct.productName}</span></p>
              </div>
            </div>
          </div>

          {/* Bottom Badges Section (Editable via BADGES constant) */}
          <div className="absolute bottom-20 md:bottom-24 left-0 w-full px-4 md:px-12 z-20">
            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-4 md:gap-8 border-t border-white/20 pt-8">
              {BADGES.map((badge, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-white text-3xl md:text-4xl mb-3 drop-shadow-md">
                      {badge.icon}
                    </div>
                    <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-pre-line">
                      {badge.label}
                    </p>
                  </div>
                  {idx < BADGES.length - 1 && <div className="hidden md:block h-12 w-px bg-white/20" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Call To Action Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-lg py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center z-20">
            <div className="flex items-center gap-4">
              <span className="bg-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Book Consultation
              </span>
              <p className="text-white text-xs md:text-sm font-bold tracking-widest">+251 911 234 567</p>
            </div>
            
            <Link href={`/Products/${currentProduct.category.toLowerCase()}`} className="mt-4 md:mt-0 flex items-center gap-2 text-white hover:text-yellow-400 transition-colors cursor-pointer group/btn">
              <span className="text-sm font-bold uppercase tracking-widest">View Product</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-yellow-500 group-hover/btn:text-black transition-all">
                <FiArrowUpRight size={16} />
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
