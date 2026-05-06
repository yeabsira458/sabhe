import React from "react";
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube, FaChevronDown } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-sm">
        
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-emerald-900 font-bold text-lg">
              F
            </div>
            <span className="text-xl font-bold tracking-wider">Furniture.</span>
          </div>
          <p className="text-emerald-50/70 mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full border border-emerald-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-emerald-900 transition-colors">
              <FaFacebookF size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-emerald-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-emerald-900 transition-colors">
              <FaTwitter size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-emerald-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-emerald-900 transition-colors">
              <FaPinterestP size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-emerald-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-emerald-900 transition-colors">
              <FaInstagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-emerald-700 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-emerald-900 transition-colors">
              <FaYoutube size={14} />
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-bold text-lg mb-6">Company</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li><a href="#" className="hover:text-yellow-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Career</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Customer Services</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li><a href="#" className="hover:text-yellow-500 transition-colors">My Account</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Track Your Order</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Return</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Our Information</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">User Terms & Condition</a></li>
            <li><a href="#" className="hover:text-yellow-500 transition-colors">Return Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li>+0123-456-789</li>
            <li>example@gmail.com</li>
            <li className="leading-relaxed">8522 Produs Rd, Inglewood, Maine 98380</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-yellow-500 text-emerald-950 font-medium py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>Copyright © 2024 Furniture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-emerald-800 transition-colors">
              English <FaChevronDown size={10} />
            </button>
            <button className="flex items-center gap-2 hover:text-emerald-800 transition-colors">
              USD <FaChevronDown size={10} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
