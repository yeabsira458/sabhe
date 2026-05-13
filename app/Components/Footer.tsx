import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube } from "react-icons/fa";

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
            <span className="text-xl font-bold tracking-wider text-emerald-100 italic">Sabhe <span className="font-light not-italic">Furniture</span></span>
          </div>
          <p className="text-emerald-100/50 mb-8 leading-relaxed text-xs">
            We craft more than just furniture; we design the backdrops for your most cherished moments. 
            Sustainable, artisanal, and timeless pieces for the modern home.
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
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Blog</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Contact Us</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Career</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Customer Services</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li><Link href="/Login" className="hover:text-yellow-500 transition-colors">My Account</Link></li>
            <li><Link href="/Login" className="hover:text-yellow-500 transition-colors">Track Your Order</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Return</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Our Information</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Privacy</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">User Terms & Condition</Link></li>
            <li><Link href="/About" className="hover:text-yellow-500 transition-colors">Return Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-emerald-50/70">
            <li className="flex items-center gap-2">+25112345678</li>
            <li>example@gmail.com</li>
            <li className="leading-relaxed">Addis abeba ሰሚት 72 ከዳሎል ማደያ ጎን</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-yellow-500 text-emerald-950 font-medium py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>Copyright © 2026 Sabhe Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
