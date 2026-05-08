"use client";

import React, { useState, useEffect, useCallback } from "react";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";
import ProductCard, { Product } from "../Components/ProductCard";
import {
  getProducts,
  getCategories,
  AppwriteProduct,
  AppwriteCategory,
} from "../../lib/appwrite";

// ── Skeleton loader ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-5 w-2/3 bg-gray-200 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-4/5 bg-gray-100 rounded-full" />
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="h-6 w-1/3 bg-gray-200 rounded-full" />
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Map Appwrite doc → ProductCard shape ───────────────────────────────────────
function toProduct(doc: AppwriteProduct): Product {
  return {
    id: doc.$id,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category.charAt(0).toUpperCase() + doc.category.slice(1),
    inStock: doc.inStock,
    featured: doc.featured,
    discount: doc.discount,
    rating: doc.rating,
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories from DB
  useEffect(() => {
    getCategories().then((cats: AppwriteCategory[]) => {
      if (cats.length > 0) {
        const names = cats.map(
          (c) => c.name.charAt(0).toUpperCase() + c.name.slice(1)
        );
        setCategories(["All", ...names]);
      }
    });
  }, []);

  // Load products whenever category changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const slug =
        activeCategory === "All" ? undefined : activeCategory.toLowerCase();
      const docs = await getProducts(slug);
      setProducts(docs.map(toProduct));
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12">

      {/* Page heading */}
      <div className="max-w-7xl mx-auto px-8 mb-10 text-center">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">
          Browse our collection
        </p>
        <h1 className="text-5xl font-black text-gray-900">
          Our <span className="text-emerald-800">Products</span>
        </h1>
      </div>

      {/* Category filter pills */}
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              id={`filter-${category.toLowerCase()}`}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-emerald-800 text-white shadow-lg shadow-emerald-800/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 px-6 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              We don&apos;t have any products in this category yet.
            </p>
          </div>
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}

