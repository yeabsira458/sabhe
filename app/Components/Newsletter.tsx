import React from "react";
import { FaEnvelope } from "react-icons/fa";

export default function Newsletter() {
  return (
    <section className="bg-[#f8f9fa] py-20 px-8">
      <div className="max-w-2xl mx-auto text-center relative">
        
        {/* Background decorative dots (simulated) */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:16px_16px] opacity-50"></div>

        <p className="text-gray-500 font-medium mb-4 flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-gray-300"></span>
          Our Newsletter
          <span className="w-8 h-[1px] bg-gray-300"></span>
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight relative z-10">
          Subscribe to Our Newsletter to Get <span className="text-emerald-800">Updates to Our Latest Collection</span>
        </h2>
        
        <p className="text-gray-500 mb-10 text-sm">
          Get 20% off on your first order just by subscribing to our newsletter
        </p>

        {/* Input form */}
        <form className="relative max-w-lg mx-auto flex items-center bg-white rounded-full p-2 shadow-sm border border-gray-100 z-10">
          <div className="pl-4 pr-2 text-emerald-800">
            <FaEnvelope size={20} />
          </div>
          <input 
            type="email" 
            placeholder="Enter Email Address..." 
            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm px-2"
            required
          />
          <button 
            type="submit" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Subscribe
          </button>
        </form>
        
      </div>
    </section>
  );
}
