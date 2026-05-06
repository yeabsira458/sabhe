"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Client, Account, OAuthProvider } from "appwrite";

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69fad27100189847d507");

const account = new Account(client);

export default function LoginPage() {
  const handleGoogleLogin = () => {
    try {
      // Redirect to Google OAuth
      account.createOAuth2Session(
        OAuthProvider.Google, 
        `${window.location.origin}/`, // Success URL (Redirects to home)
        `${window.location.origin}/Login` // Failure URL
      );
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 pt-24">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-12 text-center transform transition-all">
        {/* Logo Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <span className="text-4xl">🪑</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Sign in to Sabhe Furniture to save your favorite items and track your orders.
        </p>
        
        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold text-lg py-4 px-8 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <FaGoogle className="text-red-500 text-xl" />
          Continue with Google
        </button>
        
        <p className="text-sm text-gray-400 mt-10">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
