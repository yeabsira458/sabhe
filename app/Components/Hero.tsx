import React from "react";
import { FaArrowRight, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="pt-16 pb-24 px-8 md:px-16 bg-[#f8f9fa] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 border border-gray-100">
            <span className="text-xl">🪑</span>
            The Best Online Furniture Store
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Explore Our <span className="text-emerald-800">Modern Furniture Collection</span>
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-800/30">
              Shop Now <FaArrowRight />
            </button>
            <a href="#" className="text-gray-600 font-medium hover:text-emerald-800 transition-colors underline underline-offset-4 decoration-2 decoration-gray-300 hover:decoration-emerald-800">
              View All Products
            </a>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-4">
              <img src="https://i.pravatar.cc/100?img=1" alt="User 1" className="w-12 h-12 rounded-full border-4 border-[#f8f9fa]" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User 2" className="w-12 h-12 rounded-full border-4 border-[#f8f9fa]" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User 3" className="w-12 h-12 rounded-full border-4 border-[#f8f9fa]" />
              <div className="w-12 h-12 rounded-full border-4 border-[#f8f9fa] bg-yellow-500 flex items-center justify-center text-white text-lg">
                <FaStar />
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-900">4.9 Ratings+</p>
              <p className="text-sm text-gray-500">Trusted by 50k+ Customers</p>
            </div>
          </div>
        </div>

        {/* Right Images Layout */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          
          {/* Main Large Image (Living Room) */}
          <div className="relative z-10 bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform lg:-translate-x-12">
            <div className="rounded-2xl overflow-hidden h-[450px] w-[320px]">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600&h=800" 
                alt="Living Room" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Living Room</h3>
                <p className="text-gray-500 text-sm">2,500+ Items</p>
              </div>
              <button className="w-10 h-10 bg-emerald-800 text-white rounded-full flex items-center justify-center hover:bg-emerald-900 transition-colors">
                <FaArrowRight className="-rotate-45" />
              </button>
            </div>
          </div>

          {/* Secondary Smaller Image (Bed Room) */}
          <div className="absolute top-12 right-0 lg:-right-8 z-0 bg-white p-3 rounded-3xl shadow-xl hidden md:block">
            <div className="rounded-2xl overflow-hidden h-[300px] w-[200px]">
              <img 
                src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=400&h=600" 
                alt="Bed Room" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 px-2">
              <h3 className="font-bold text-gray-900">Bed Room</h3>
              <p className="text-gray-500 text-xs">1,500+ Items</p>
            </div>
          </div>

          {/* Decoration Navigation Buttons */}
          <div className="absolute -bottom-6 lg:-bottom-12 left-1/2 lg:left-32 flex gap-3 z-20">
            <button className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center hover:bg-emerald-900 transition-colors shadow-lg">
              <FaArrowRight className="rotate-180" />
            </button>
            <button className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg">
              <FaArrowRight />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
