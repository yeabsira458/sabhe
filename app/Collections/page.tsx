import React from "react";
import Categories from "../Components/Categories";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24">
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-20 px-8 text-center relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <img 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1920&h=600" 
              alt="Collections Background" 
              className="w-full h-full object-cover"
           />
        </div>
        <div className="relative z-10">
          <p className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-4">Curated For You</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Collections</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Explore our thoughtfully curated collections designed to match every aesthetic and lifestyle. From minimalist modern to classic comfort.
          </p>
        </div>
      </div>
      
      {/* Collections Content */}
      <div className="py-12">
        <Categories />
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
}
