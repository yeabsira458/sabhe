import React from "react";
import { FaBoxOpen, FaWallet, FaHeadset } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaBoxOpen size={28} className="text-yellow-500" />,
      title: "Free Shipping",
      desc: "Free shipping for order above $180",
    },
    {
      icon: <FaWallet size={28} className="text-yellow-500" />,
      title: "Flexible Payment",
      desc: "Multiple secure payment options",
    },
    {
      icon: <FaHeadset size={28} className="text-emerald-800" />,
      title: "24x7 Support",
      desc: "We support online all days.",
    },
  ];

  return (
    <section className="bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-12 md:gap-24">
        {features.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-800/5 mix-blend-multiply"></div>
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
