"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "../../lib/appwrite";

export default function Categories() {
  const [chairs, setChairs] = useState<string[]>([]);
  const [sofas, setSofas] = useState<string[]>([]);
  const [dressers, setDressers] = useState<string[]>([]);

  const [chairIdx, setChairIdx] = useState(0);
  const [sofaIdx, setSofaIdx] = useState(0);
  const [dresserIdx, setDresserIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const allProducts = await getProducts();
        
        // Filter images by category
        const chairImgs = allProducts
          .filter(p => p.category.toLowerCase().includes("chair") || p.category.toLowerCase().includes("stool"))
          .map(p => p.image).filter(Boolean);
          
        const sofaImgs = allProducts
          .filter(p => p.category.toLowerCase().includes("sofa") || p.category.toLowerCase().includes("couch"))
          .map(p => p.image).filter(Boolean);
          
        const dresserImgs = allProducts
          .filter(p => p.category.toLowerCase().includes("dresser") || p.category.toLowerCase().includes("cabinet"))
          .map(p => p.image).filter(Boolean);

        if (chairImgs.length > 0) setChairs(chairImgs);
        if (sofaImgs.length > 0) setSofas(sofaImgs);
        if (dresserImgs.length > 0) setDressers(dresserImgs);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // Intervals for image rotation
  useEffect(() => {
    const chairTimer = setInterval(() => {
      setChairIdx(prev => chairs.length ? (prev + 1) % chairs.length : 0);
    }, 4000); // 4 seconds

    const sofaTimer = setInterval(() => {
      setSofaIdx(prev => sofas.length ? (prev + 1) % sofas.length : 0);
    }, 5000); // 5 seconds

    const dresserTimer = setInterval(() => {
      setDresserIdx(prev => dressers.length ? (prev + 1) % dressers.length : 0);
    }, 6000); // 6 seconds

    return () => {
      clearInterval(chairTimer);
      clearInterval(sofaTimer);
      clearInterval(dresserTimer);
    };
  }, [chairs.length, sofas.length, dressers.length]);

  const defaultChair = "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=800";
  const defaultSofa = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=400";
  const defaultDresser = "https://images.unsplash.com/photo-1595514535316-c956cb5e23ba?auto=format&fit=crop&q=80&w=600&h=400"; // Dresser fallback

  const currentChair = chairs.length > 0 ? chairs[chairIdx] : defaultChair;
  const currentSofa = sofas.length > 0 ? sofas[sofaIdx] : defaultSofa;
  const currentDresser = dressers.length > 0 ? dressers[dresserIdx] : defaultDresser;

  return (
    <section className="bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Large Card - Chairs */}
        <Link 
          href="/Products/chair"
          className="bg-[#f8f9fa] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="relative z-10 flex-1">
            <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
              {chairs.length > 0 ? `${chairs.length} Items` : "1500+ Items"}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Chairs</h2>
            <p className="text-gray-500 text-sm max-w-[200px] mb-6">
              Comfortable seating for every room in your home.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-emerald-800 transition-colors">Gaming Chair</li>
              <li className="hover:text-emerald-800 transition-colors">Lounge Chair</li>
              <li className="hover:text-emerald-800 transition-colors">Folding Chair</li>
              <li className="hover:text-emerald-800 transition-colors">Dining Chair</li>
            </ul>
          </div>
          <div className="flex-1 mt-8 md:mt-0 relative h-[400px] md:h-auto min-h-[500px]">
            <img 
              key={currentChair}
              src={currentChair} 
              alt="Chair" 
              className="absolute right-[-60px] md:right-[-100px] bottom-[-60px] md:bottom-[-80px] w-[150%] h-[150%] object-contain mix-blend-multiply transition-opacity duration-1000 animate-in fade-in group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Right Column - Stacked Cards */}
        <div className="flex flex-col gap-8">
          
          {/* Top Card - Sofa */}
          <Link 
            href="/Products/sofa"
            className="bg-[#f8f9fa] rounded-3xl p-8 relative overflow-hidden flex shadow-sm hover:shadow-md transition-all group cursor-pointer h-full"
          >
            <div className="relative z-10 flex-1">
              <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
                {sofas.length > 0 ? `${sofas.length} Items` : "750+ Items"}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sofa</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-emerald-800 transition-colors">Reception Sofa</li>
                <li className="hover:text-emerald-800 transition-colors">Sectional Sofa</li>
              </ul>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <img 
                key={currentSofa}
                src={currentSofa} 
                alt="Sofa" 
                className="absolute right-[-20px] bottom-[-20px] w-[130%] h-[130%] object-contain mix-blend-multiply transition-opacity duration-1000 animate-in fade-in group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Bottom Card - Dresser */}
          <Link 
            href="/Products/dresser"
            className="bg-[#f8f9fa] rounded-3xl p-8 relative overflow-hidden flex shadow-sm hover:shadow-md transition-all group cursor-pointer h-full"
          >
            <div className="relative z-10 flex-1">
              <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
                {dressers.length > 0 ? `${dressers.length} Items` : "450+ Items"}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dresser</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-emerald-800 transition-colors">Bedroom Dressers</li>
                <li className="hover:text-emerald-800 transition-colors">Cabinets</li>
              </ul>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <img 
                key={currentDresser}
                src={currentDresser} 
                alt="Dresser" 
                className="absolute right-[-20px] bottom-[-20px] w-[130%] h-[130%] object-contain mix-blend-multiply transition-opacity duration-1000 animate-in fade-in group-hover:scale-105"
              />
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}
