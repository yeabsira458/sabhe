import React from "react";
import Footer from "../Components/Footer";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24">
      {/* Page Header */}
      <div className="pt-8 pb-4 px-8 text-center">
        <span className="text-emerald-800 font-bold tracking-widest uppercase text-sm mb-2 block">We're Here To Help</span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </div>
      
      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Contact Info */}
        <div className="lg:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Have questions about your order or want to know more about our furniture? Don't hesitate to reach out!
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Our Location</h4>
                <p className="text-gray-500 mt-1">123 Furniture Street, Design District, NY 10001, USA</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center shrink-0">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Call Us</h4>
                <p className="text-gray-500 mt-1">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Email Us</h4>
                <p className="text-gray-500 mt-1">support@sabhefurniture.com<br/>sales@sabhefurniture.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center shrink-0">
                <FaClock size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Working Hours</h4>
                <p className="text-gray-500 mt-1">Mon - Fri: 9:00 AM - 8:00 PM<br/>Sat - Sun: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:w-2/3 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">First Name</label>
                <input 
                  type="text" 
                  placeholder="John" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors bg-[#f8f9fa]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors bg-[#f8f9fa]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors bg-[#f8f9fa]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors bg-[#f8f9fa]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Message</label>
              <textarea 
                rows={5} 
                placeholder="How can we help you?" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors bg-[#f8f9fa] resize-none"
              ></textarea>
            </div>
            
            <button 
              type="button" 
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-800/20"
            >
              Send Message
            </button>
          </form>
        </div>
        
      </div>
      
      {/* Map Integration */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <div className="w-full h-[300px] md:h-[450px] bg-gray-200 relative rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d858.6883338923083!2d38.867605263015975!3d9.001825270442886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9b004948c09b%3A0xd6652da0049ada4a!2zU2VtaXQgNzIgPSDhiLDhiJrhibUgNzI!5e0!3m2!1sen!2set!4v1778044764540!5m2!1sen!2set" 
            className="w-full h-full"
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
