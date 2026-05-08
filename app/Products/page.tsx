"use client";

import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";
import ProductCard, { Product } from "../Components/ProductCard";
import { getProducts, AppwriteProduct } from "../../lib/appwrite";

const SLIDER_NAMES = [
  "Dining Table",
  "Sofa",
  "Chair",
  "Bedside Table",
  "Wardrobe",
  "Kitchen Set",
  "Coffee Table",
  "Bookshelf",
  "Dresser",
  "TV Stand",
];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const docs = await getProducts();
        setAllProducts(
          docs.map((doc: AppwriteProduct) => ({
            id: doc.$id,
            title: doc.title,
            description: doc.description,
            price: doc.price,
            image: doc.image,
            category: doc.category,
            inStock: doc.inStock,
            featured: doc.featured,
            discount: doc.discount,
            rating: doc.rating,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Header Section (Minimal Editorial) */}
      <div className="pt-40 pb-20 px-8 md:px-16 border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">
            Coleção 2026 — Sabhe Móveis
          </p>
          <h1 className="text-7xl md:text-8xl font-thin tracking-tighter text-gray-900 leading-none mb-12">
            Design <span className="italic font-normal">Sustentável</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <p className="text-lg text-gray-500 max-w-md font-light leading-relaxed">
              Explore ambientes curados onde a forma encontra a função em sua expressão mais pura. 
              Peças desenhadas para elevar o cotidiano através da sofisticação minimalista.
            </p>
            <div className="flex justify-end gap-24">
              <div className="flex flex-col">
                <span className="text-4xl font-light">{SLIDER_NAMES.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Categorias</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-light">{allProducts.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Peças Únicas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Sections per Slider Name (Behance Style) */}
      <div className="px-8 md:px-16 py-24 space-y-32 max-w-screen-2xl mx-auto">
        {SLIDER_NAMES.map((name) => {
          const categoryProducts = allProducts.filter(
            (p) => p.category.toLowerCase() === name.toLowerCase()
          );

          if (categoryProducts.length === 0 && !loading) return null;

          return (
            <section key={name} className="space-y-12">
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-8">
                <div className="space-y-2">
                   <h2 className="text-4xl font-extralight tracking-tight text-gray-900">
                     {name}
                   </h2>
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                     Explore as variações de {name.toLowerCase()}
                   </p>
                </div>
                <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">
                  Vol. 01 / Ref. 2259
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-1 gap-y-16">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse" />
                    ))
                  : categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>
            </section>
          );
        })}

        {/* Fallback for "Others" or products not in the slider names list */}
        {!loading && (
          <section className="space-y-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-baseline justify-between border-b border-gray-100 pb-8">
                <h2 className="text-4xl font-extralight tracking-tight text-gray-900">
                  Complementos
                </h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                {allProducts
                  .filter(p => !SLIDER_NAMES.some(n => n.toLowerCase() === p.category.toLowerCase()))
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                }
             </div>
          </section>
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
