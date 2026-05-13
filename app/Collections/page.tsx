"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../Components/Footer";
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

function toProduct(doc: AppwriteProduct): Product {
  return {
    id: doc.$id,
    title: doc.productName,
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

function CollectionsContent() {
  const searchParams = useSearchParams();
  const search = searchParams?.get("search") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then((cats: AppwriteCategory[]) => {
      if (cats.length > 0) {
        const names = cats
          .filter(c => c.categoryName)
          .map(c => c.categoryName.charAt(0).toUpperCase() + c.categoryName.slice(1));
        setCategories(["All", ...names]);
      }
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const slug = activeCategory === "All" ? undefined : activeCategory.toLowerCase();
      // Use both category and search query
      const docs = await getProducts(slug, search || undefined);
      setProducts(docs.map(toProduct));
    } catch {
      setError("Failed to load collections. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8 mb-10 text-center">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">
          {search ? `Showing results for "${search}"` : "Curated for you"}
        </p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight">
          {search ? "Search" : "Our"} <span className="text-emerald-800">{search ? "Results" : "Collections"}</span>
        </h1>
      </div>

      {!search && (
        <div className="max-w-7xl mx-auto px-8 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
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
      )}

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

      <div className="max-w-7xl mx-auto px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any items matching your request. Try a different keyword or category.
            </p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                window.history.pushState({}, "", "/Collections");
              }}
              className="mt-8 text-emerald-800 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
