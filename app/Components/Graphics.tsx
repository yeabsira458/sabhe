"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getProducts } from "../../lib/appwrite";

export default function Graphics() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGraphics() {
      try {
        const allProducts = await getProducts();
        const withImages = allProducts.filter((p: any) => p.image).slice(0, 10);
        setProducts(withImages);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGraphics();
  }, []);

  if (products.length === 0) return null;

  const mainProduct = products[0];
  const smallProducts = products.slice(1, 10);

  // Fill empty slots up to 9
  const displaySmall: any[] = [...smallProducts];
  while (displaySmall.length < 9) {
    displaySmall.push({
      $id: `dummy-${displaySmall.length}`,
      title: "Coming Soon",
      price: 0,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=400",
      category: "Catalog",
    });
  }

  return (
    <section className="bg-white py-16 px-4 md:px-8 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">New Collection</h2>
          <div className="flex gap-4 mt-4 md:mt-0 items-center">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden md:block">
              {products.length} Items Listed
            </span>
            <button className="bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-800 transition-colors px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Filters <FaArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Grid: 5 columns, 2 rows */}
        {/* Row 1: Big (col 1-2) + 3 small (col 3,4,5) */}
        {/* Row 2: 5 small (col 1-5) */}
        <div className="grid grid-cols-5 grid-rows-2 gap-4 h-[700px] md:h-[800px]">

          {/* BIG card — col 1-2, row 1-2 */}
          <Link
            href={`/product/${mainProduct.$id}`}
            className="col-span-2 row-span-2 bg-[#f8f9fa] rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100"
          >
            <img
              src={mainProduct.image}
              alt={mainProduct.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Enhanced
            </div>

            <div className="absolute left-6 bottom-8 z-20">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md line-clamp-2">
                {mainProduct.title}
              </h3>
              <p className="text-emerald-400 text-sm font-bold mt-2 tracking-widest uppercase">
                {mainProduct.price.toLocaleString()} ETB
              </p>
            </div>
          </Link>

          {/* 3 small cards on right — row 1, col 3,4,5 */}
          {displaySmall.slice(0, 3).map((item, idx) => (
            <Link
              key={item.$id + "-top-" + idx}
              href={`/product/${item.$id}`}
              className="col-span-1 row-span-1 bg-[#f8f9fa] rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-emerald-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                <h4 className="text-gray-900 text-xs font-black uppercase truncate tracking-wider">{item.title}</h4>
                {item.price > 0 && (
                  <p className="text-emerald-800 text-[10px] font-bold mt-0.5">{item.price.toLocaleString()} ETB</p>
                )}
              </div>
            </Link>
          ))}

          {/* 5 small cards — row 2, col 3,4,5 + overflow goes to 2 more but since we only have 3 cols left in row 2 from col 3-5 we need another row */}
          {/* Actually col 3-5 in row 2 = 3 cells. Plus we already have col 1-2 in row 2 used by big. So row 2 small = displaySmall[3..7] (5 cells, but col 1-2 is big so only 3 remain in row 2) */}
          {/* We'll just push remaining 6 as a new row below */}
          {displaySmall.slice(3, 6).map((item, idx) => (
            <Link
              key={item.$id + "-bot-" + idx}
              href={`/product/${item.$id}`}
              className="col-span-1 row-span-1 bg-[#f8f9fa] rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-emerald-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                <h4 className="text-gray-900 text-xs font-black uppercase truncate tracking-wider">{item.title}</h4>
                {item.price > 0 && (
                  <p className="text-emerald-800 text-[10px] font-bold mt-0.5">{item.price.toLocaleString()} ETB</p>
                )}
              </div>
            </Link>
          ))}

        </div>

        {/* Row 3 — last 3 small cards in a separate row below */}
        {displaySmall.length > 6 && (
          <div className="grid grid-cols-5 gap-4 mt-4 h-[200px] md:h-[250px]">
            {displaySmall.slice(6, 9).map((item, idx) => (
              <Link
                key={item.$id + "-last-" + idx}
                href={`/product/${item.$id}`}
                className="col-span-1 row-span-1 bg-[#f8f9fa] rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-emerald-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                  <h4 className="text-gray-900 text-xs font-black uppercase truncate tracking-wider">{item.title}</h4>
                  {item.price > 0 && (
                    <p className="text-emerald-800 text-[10px] font-bold mt-0.5">{item.price.toLocaleString()} ETB</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
