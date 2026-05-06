import React from "react";

export default function Categories() {
  return (
    <section className="bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Large Card - Chairs */}
        <div className="bg-[#f8f9fa] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row shadow-sm">
          <div className="relative z-10 flex-1">
            <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
              1500+ Items
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Chairs</h2>
            <p className="text-gray-500 text-sm max-w-[200px] mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Gaming Chair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Lounge Chair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Folding Chair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Dining Chair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Office Chair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Armchair</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Bar Stool</li>
              <li className="hover:text-emerald-800 cursor-pointer transition-colors">Club Chair</li>
            </ul>
          </div>
          <div className="flex-1 mt-8 md:mt-0 relative h-[300px] md:h-auto min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=800" 
              alt="Chair" 
              className="absolute right-[-40px] md:right-[-80px] bottom-[-40px] md:bottom-[-60px] w-[120%] h-[120%] object-contain"
            />
          </div>
        </div>

        {/* Right Column - Stacked Cards */}
        <div className="flex flex-col gap-8">
          
          {/* Top Card - Sofa */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 relative overflow-hidden flex shadow-sm h-full">
            <div className="relative z-10 flex-1">
              <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
                750+ Items
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sofa</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Reception Sofa</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Sectional Sofa</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Armless Sofa</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Curved Sofa</li>
              </ul>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=400" 
                alt="Sofa" 
                className="absolute right-[-20px] bottom-[-20px] w-[130%] h-[130%] object-contain"
              />
            </div>
          </div>

          {/* Bottom Card - Lighting */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 relative overflow-hidden flex shadow-sm h-full">
            <div className="relative z-10 flex-1">
              <span className="inline-block text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full text-sm mb-4">
                450+ Items
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Lighting</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Table Lights</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Floor Lights</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Ceiling Lights</li>
                <li className="hover:text-emerald-800 cursor-pointer transition-colors">Wall Lights</li>
              </ul>
            </div>
            <div className="flex-1 relative min-h-[200px]">
              <img 
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600&h=400" 
                alt="Lighting" 
                className="absolute right-[-20px] bottom-[-20px] w-[130%] h-[130%] object-contain drop-shadow-xl"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
