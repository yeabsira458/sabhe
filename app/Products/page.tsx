"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";
import { getCategories, getProducts, AppwriteCategory, AppwriteProduct } from "../../lib/appwrite";
import Image from "next/image";

function CategoryCard({ category, products }: { category: AppwriteCategory; products: AppwriteProduct[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products that have images
  const validProducts = products.filter((p) => p.image);

  useEffect(() => {
    if (validProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validProducts.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [validProducts.length]);

  const categoryName = category.categoryName || "Unknown";

  // Decide which image to show:
  // 1. If we have products with images, cycle through them
  // 2. Otherwise fallback to the category's own iconUrl
  const currentImage =
    validProducts.length > 0 ? validProducts[currentIndex].image : category.iconUrl;

  return (
    <Link
      href={`/Products/${categoryName.toLowerCase()}`}
      className="group relative block aspect-square overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {currentImage ? (
        <img
          src={currentImage}
          alt={categoryName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 font-light">No image available</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h2 className="text-3xl font-extralight tracking-tight text-white mb-2">
          {categoryName}
        </h2>
        {category.description && (
          <p className="text-sm font-light text-white/80 line-clamp-2">
            {category.description}
          </p>
        )}
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
          {validProducts.length} Pieces • Explore →
        </p>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<AppwriteCategory[]>([]);
  const [allProducts, setAllProducts] = useState<AppwriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(), // fetch all products to show their images
        ]);
        setCategories(cats);
        setAllProducts(prods);
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
            2026 Collection — Sabhe Furniture
          </p>
          <h1 className="text-7xl md:text-8xl font-thin tracking-tighter text-gray-900 leading-none mb-12">
            Our <span className="italic font-normal">Collections</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <p className="text-lg text-gray-500 max-w-md font-light leading-relaxed">
              Discover curated spaces where form meets function in its purest expression. 
              Select a category to view unique pieces designed to elevate your daily life.
            </p>
            <div className="flex justify-end gap-24">
              <div className="flex flex-col">
                <span className="text-4xl font-light">{loading ? "-" : categories.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Collections</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="px-8 md:px-16 py-24 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl" />
              ))
            : categories.map((category) => {
                const categoryName = category.categoryName || "";
                // Find products belonging to this specific category
                const categoryProducts = allProducts.filter(
                  (p) => p.category.toLowerCase() === categoryName.toLowerCase()
                );

                return (
                  <CategoryCard
                    key={category.$id}
                    category={category}
                    products={categoryProducts}
                  />
                );
              })}
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
