"use client";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Default open second item

  const faqs = [
    {
      question: "What types of furniture do you offer?",
      answer: "We offer a wide range of modern and classic furniture including sofas, chairs, tables, beds, wardrobes, and home decor items tailored to elevate your living spaces.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    {
      question: "Can I track my furniture delivery?",
      answer: "Yes, once your order is shipped, you will receive a tracking link via email to monitor your delivery status in real-time.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. If you're not satisfied, you can return the product in its original condition for a full refund.",
    },
    {
      question: "What materials are used in your furniture?",
      answer: "Our furniture is crafted using premium materials like solid oak, walnut, high-density foam, and top-grain leather to ensure durability and style.",
    },
    {
      question: "Are there any discounts or promotions available?",
      answer: "Yes, we frequently run seasonal promotions. Please subscribe to our newsletter to stay updated on the latest deals.",
    },
  ];

  return (
    <section className="bg-white py-20 px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium mb-2 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Faqs
            <span className="w-8 h-[1px] bg-gray-300"></span>
          </p>
          <h2 className="text-4xl font-bold text-gray-900">
            Question? <span className="text-emerald-800">Look here.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isOpen ? "bg-emerald-800 border-emerald-800" : "bg-white border-gray-200"
                }`}
              >
                <button 
                  className={`w-full flex items-center justify-between p-6 text-left font-bold transition-colors ${
                    isOpen ? "text-white" : "text-gray-900 hover:text-emerald-800"
                  }`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {faq.question}
                  {isOpen ? <FaMinus className="flex-shrink-0" /> : <FaPlus className="flex-shrink-0" />}
                </button>
                
                {/* Expandable Answer */}
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 py-0 opacity-0"
                  }`}
                >
                  <p className={isOpen ? "text-emerald-50" : "text-gray-500"}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
