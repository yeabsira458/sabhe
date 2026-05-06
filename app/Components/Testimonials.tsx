import React from "react";
import { FaStar, FaQuoteRight } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Leslie Alexander",
      role: "Architectural",
      rating: 5.0,
      image: "https://i.pravatar.cc/150?img=5",
      quote: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.",
    },
    {
      id: 2,
      name: "Jenny Wilson",
      role: "Interior Designer",
      rating: 5.0,
      image: "https://i.pravatar.cc/150?img=9",
      quote: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.",
    },
  ];

  return (
    <section className="bg-[#f8f9fa] py-20 px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium mb-2 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Testimonials
            <span className="w-8 h-[1px] bg-gray-300"></span>
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            What <span className="text-emerald-800">Our Clients Say</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-800 p-1">
                    <img src={item.image} alt={item.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500 mb-1">{item.role}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar size={12} />
                      <FaStar size={12} />
                      <FaStar size={12} />
                      <FaStar size={12} />
                      <FaStar size={12} />
                      <span className="text-gray-900 font-bold text-xs ml-1">{item.rating}</span>
                    </div>
                  </div>
                </div>
                <FaQuoteRight size={32} className="text-emerald-800/10" />
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
