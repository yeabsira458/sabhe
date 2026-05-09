"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingBag, FaStar, FaTag } from "react-icons/fa";
import { getProducts, AppwriteProduct } from "../../lib/appwrite";

// ── Props ──────────────────────────────────────────────────────────────────────
interface ProductGridProps {
  /** Pass a category slug (e.g. "sofa") to filter. Omit to show all. */
  categorySlug?: string;
  /** Max number of products to display. Defaults to 8. */
  limit?: number;
  /** Show the tab bar (All / Featured / In Stock / On Sale). Defaults to true. */
  showTabs?: boolean;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonProductCard() {
  return (
    <div className="group cursor-pointer animate-pulse">
      <div className="relative bg-[#f0f0f0] rounded-2xl mb-4 overflow-hidden h-[300px]" />
      <div className="px-2 space-y-2">
        <div className="h-3 w-1/4 bg-gray-200 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-4 w-1/3 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ── Single Card ────────────────────────────────────────────────────────────────
function ProductGridCard({ product }: { product: AppwriteProduct }) {
  const discountedPrice =
    product.discount && product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : null;

  return (
    <div className="group cursor-pointer">
      {/* Image Box */}
      <div className="relative bg-[#f8f9fa] rounded-2xl p-6 mb-4 overflow-hidden h-[300px] flex items-center justify-center transition-shadow group-hover:shadow-lg">

        {/* Badges */}
        {product.discount && product.discount > 0 ? (
          <div className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1">
            <FaTag size={9} />
            -{product.discount}%
          </div>
        ) : !product.inStock ? (
          <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            Out of Stock
          </div>
        ) : null}

        {/* Hover actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 z-10 duration-300">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm">
            <FaHeart size={14} />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm">
            <FaShoppingBag size={14} />
          </button>
        </div>

        {/* Product image — stored in Appwrite bucket 69fddb13000e96d29eac */}
        <img
          src={
            product.image ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=400"
          }
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="px-2">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="text-gray-400 capitalize">{product.category}</span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <FaStar size={12} />
              <span className="text-gray-900 font-bold text-xs">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-800 transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            {discountedPrice
              ? `${discountedPrice.toLocaleString()} ETB`
              : `${product.price.toLocaleString()} ETB`}
          </span>
          {discountedPrice && (
            <span className="text-gray-400 line-through text-sm">
              {product.price.toLocaleString()} ETB
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const TABS = ["All Products", "Featured", "In Stock", "On Sale"] as const;
type Tab = (typeof TABS)[number];

export default function ProductGrid({
  categorySlug,
  limit = 8,
  showTabs = true,
}: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Featured");
  const [allProducts, setAllProducts] = useState<AppwriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Pass categorySlug so Appwrite filters server-side
    getProducts(categorySlug).then((docs) => {
      setAllProducts(docs);
      setLoading(false);
    });
  }, [categorySlug]);

  const displayed = allProducts
    .filter((p) => {
      if (!showTabs) return true; // skip tab filter when tabs hidden
      if (activeTab === "Featured") return p.featured;
      if (activeTab === "In Stock") return p.inStock;
      if (activeTab === "On Sale") return p.discount && p.discount > 0;
      return true; // "All Products"
    })
    .slice(0, limit);

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium mb-2 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-300" />
            {categorySlug
              ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Collection`
              : "Our Products"}
            <span className="w-8 h-[1px] bg-gray-300" />
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            {categorySlug ? (
              <>
                Shop <span className="text-emerald-800 capitalize">{categorySlug}</span>
              </>
            ) : (
              <>
                Our <span className="text-emerald-800">Products Collections</span>
              </>
            )}
          </h2>
        </div>

        {/* Tabs — only when showTabs=true */}
        {showTabs && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`grid-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors border ${
                  activeTab === tab
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-emerald-800 hover:text-emerald-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)
          ) : displayed.length > 0 ? (
            displayed.map((p) => <ProductGridCard key={p.$id} product={p} />)
          ) : (
            <div className="col-span-4 text-center py-16 text-gray-400">
              No products found{categorySlug ? ` in "${categorySlug}"` : ""}.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
