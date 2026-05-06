import React from "react";
import ProductGrid from "../Components/ProductGrid";
import Footer from "../Components/Footer";
import Newsletter from "../Components/Newsletter";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24">
      {/* Page Header */}
      <div className="bg-emerald-800 text-white py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto">
          Discover our wide range of premium furniture designed to elevate your living spaces. 
          Quality craftsmanship meets modern design.
        </p>
      </div>
      
      {/* Products Content */}
      <div className="py-8">
        <ProductGrid />
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
}
