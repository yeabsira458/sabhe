"use client";

import React, { useState } from "react";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";
import ProductCard, { Product } from "../Components/ProductCard";

const mockProducts: Product[] = [
  { id: "1", title: "Modern Sofa", description: "Plush, comfortable seating for your living room with premium fabric.", price: 25000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=600", category: "Sofas" },
  { id: "2", title: "Wooden Dining Table", description: "Sturdy oak dining table that perfectly seats six people.", price: 18000, image: "https://images.unsplash.com/photo-1617806118233-18e1c0945620?auto=format&fit=crop&q=80&w=600&h=600", category: "Tables" },
  { id: "3", title: "Queen Size Bed", description: "Elegant wooden frame with premium finish for a peaceful sleep.", price: 35000, image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600&h=600", category: "Beds" },
  { id: "4", title: "Ergonomic Office Table", description: "Spacious desk designed for productivity and long working hours.", price: 12500, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600&h=600", category: "Tables" },
  { id: "5", title: "Spacious Wardrobe", description: "Large multi-compartment wardrobe with ample storage space.", price: 28000, image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=600&h=600", category: "Storage" },
  { id: "6", title: "Glass Coffee Table", description: "Minimalist center table for modern and chic living spaces.", price: 8500, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600&h=600", category: "Tables" },
  { id: "7", title: "Tall Bookshelf", description: "Five-tier shelf perfectly suited for books and decorative pieces.", price: 10500, image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600&h=600", category: "Storage" },
  { id: "8", title: "Modern TV Unit", description: "Sleek entertainment center with integrated cable management.", price: 15000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600&h=600", category: "Storage" },
  { id: "9", title: "Dining Chair Set", description: "Set of 4 comfortable dining chairs with ergonomic backrests.", price: 12000, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600&h=600", category: "Chairs" },
  { id: "10", title: "Executive Office Chair", description: "Adjustable executive chair with premium lumbar support.", price: 9500, image: "https://images.unsplash.com/photo-1505751104546-4b63a761eb3e?auto=format&fit=crop&q=80&w=600&h=600", category: "Chairs" },
  { id: "11", title: "Minimalist Nightstand", description: "Compact bedside table with one drawer and an open shelf.", price: 4500, image: "https://images.unsplash.com/photo-1532372576444-ea95f036c196?auto=format&fit=crop&q=80&w=600&h=600", category: "Tables" },
  { id: "12", title: "Lounge Armchair", description: "Cozy and soft reading chair with beautiful velvet upholstery.", price: 14000, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600&h=600", category: "Chairs" },
];

const categories = ["All", "Sofas", "Tables", "Beds", "Chairs", "Storage"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12">
      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-emerald-800 text-white shadow-lg shadow-emerald-800/30 scale-105 transform" 
                  : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">We don't have any products in this category yet.</p>
          </div>
        )}
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
}
