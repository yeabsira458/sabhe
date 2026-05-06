"use client";
import React, { useState } from "react";
import { FaHeart, FaExpandArrowsAlt, FaShoppingBag, FaStar } from "react-icons/fa";

export default function ProductGrid() {
  const [activeTab, setActiveTab] = useState("Latest Products");
  const tabs = ["All Products", "Latest Products", "Best Sellers", "Featured Products"];

  const products = [
    {
      id: 1,
      tag: "50% off",
      tagColor: "bg-emerald-800",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400&h=400",
      type: "Chair",
      title: "Wooden Sofa Chair",
      price: "$80.00",
      oldPrice: "$160.00",
      rating: "4.9",
      hasCountdown: true,
    },
    {
      id: 2,
      tag: "10% off",
      tagColor: "bg-emerald-800",
      image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=400&h=400",
      type: "Chair",
      title: "Circular Sofa Chair",
      price: "$108.00",
      oldPrice: "$120.00",
      rating: "5.0",
      hasCountdown: false,
    },
    {
      id: 3,
      tag: "10% off",
      tagColor: "bg-emerald-800",
      image: "https://images.unsplash.com/photo-1532372576444-ea95f036c196?auto=format&fit=crop&q=80&w=400&h=400",
      type: "Nightstand",
      title: "Wooden Nightstand",
      price: "$54.00",
      oldPrice: "$60.00",
      rating: "4.8",
      hasCountdown: false,
    },
    {
      id: 4,
      tag: "10% off",
      tagColor: "bg-emerald-800",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=400",
      type: "Chair",
      title: "Bean Bag Chair",
      price: "$72.00",
      oldPrice: "$80.00",
      rating: "4.5",
      hasCountdown: false,
    },
  ];

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium mb-2 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Our Products
            <span className="w-8 h-[1px] bg-gray-300"></span>
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            Our <span className="text-emerald-800">Products Collections</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Box */}
              <div className="relative bg-[#f8f9fa] rounded-2xl p-6 mb-4 overflow-hidden h-[300px] flex items-center justify-center transition-shadow group-hover:shadow-lg">
                
                {/* Tags */}
                <div className={`absolute top-4 left-4 ${product.tagColor} text-white text-xs font-bold px-2 py-1 rounded-md z-10`}>
                  {product.tag}
                </div>

                {/* Hover Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 z-10 duration-300">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm">
                    <FaHeart size={14} />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm">
                    <FaExpandArrowsAlt size={14} />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm">
                    <FaShoppingBag size={14} />
                  </button>
                </div>

                {/* Image */}
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />

                {/* Countdown Timer (if true) */}
                {product.hasCountdown && (
                  <div className="absolute bottom-4 left-4 right-4 bg-yellow-500 rounded-xl p-2 flex justify-between text-center shadow-lg">
                    <div className="flex flex-col"><span className="text-lg font-bold text-gray-900">05</span><span className="text-[10px] text-gray-800 uppercase">Days</span></div>
                    <span className="text-gray-900 font-bold">:</span>
                    <div className="flex flex-col"><span className="text-lg font-bold text-gray-900">12</span><span className="text-[10px] text-gray-800 uppercase">Hours</span></div>
                    <span className="text-gray-900 font-bold">:</span>
                    <div className="flex flex-col"><span className="text-lg font-bold text-gray-900">30</span><span className="text-[10px] text-gray-800 uppercase">Mins</span></div>
                    <span className="text-gray-900 font-bold">:</span>
                    <div className="flex flex-col"><span className="text-lg font-bold text-gray-900">25</span><span className="text-[10px] text-gray-800 uppercase">Sec</span></div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="px-2">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-gray-400">{product.type}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar size={12} />
                    <span className="text-gray-900 font-bold text-xs">{product.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-800 transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{product.price}</span>
                  <span className="text-gray-400 line-through text-sm">{product.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
