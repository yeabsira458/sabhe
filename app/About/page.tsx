import React from "react";
import Footer from "../Components/Footer";
import { FaCheckCircle } from "react-icons/fa";

export default function AboutPage() {
  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "50k+", label: "Happy Customers" },
    { value: "120+", label: "Store Locations" },
    { value: "5k+", label: "Furniture Designs" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24">
      {/* Hero Section */}
      <section className="px-8 py-16 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-6">
          <p className="text-emerald-800 font-bold tracking-wider uppercase text-sm">About Sabhe</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Crafting Comfort, <br/>
            <span className="text-gray-500">Elevating Spaces.</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed pt-4">
            Since our inception, Sabhe Furniture has been dedicated to creating timeless pieces that transform houses into homes. We believe that furniture should be both beautiful and functional, designed to withstand the test of time.
          </p>
          <div className="pt-6 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-800 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-900">Premium Quality</h4>
                <p className="text-gray-500 text-sm mt-1">Sourced from the finest materials globally.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-800 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-900">Sustainable</h4>
                <p className="text-gray-500 text-sm mt-1">Eco-friendly practices in every step.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl z-10">
            <img 
              src="https://images.unsplash.com/photo-1618220179428-22790b46a018?auto=format&fit=crop&q=80&w=800&h=1000" 
              alt="Our Workshop" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Decorative box */}
          <div className="absolute -bottom-8 -left-8 w-2/3 h-2/3 bg-emerald-800 rounded-3xl z-0 hidden md:block"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-800">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story / Values */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Values</h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Everything we do is guided by these principles, ensuring we deliver the best possible experience and product to our customers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Craftsmanship",
              desc: "Every piece is carefully constructed by skilled artisans who take pride in their work.",
              icon: "🛠️"
            },
            {
              title: "Innovation",
              desc: "We continuously explore new designs, materials, and technologies to improve our furniture.",
              icon: "💡"
            },
            {
              title: "Customer First",
              desc: "Your satisfaction is our ultimate goal. We strive to provide exceptional service at every touchpoint.",
              icon: "❤️"
            }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6 bg-gray-50 w-16 h-16 flex items-center justify-center rounded-xl">{val.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
              <p className="text-gray-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
