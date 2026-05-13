"use client";

import React, { useState } from "react";
import { FaGoogle, FaPhone, FaSpinner } from "react-icons/fa";
import { account } from "../../lib/appwrite";
import { OAuthProvider } from "appwrite";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\s+/g, "");
    return cleaned.length >= 9 && /^[+\d]+$/.test(cleaned);
  };

  const handleGoogleLogin = () => {
    if (!phone.trim()) {
      setPhoneError("Please enter your phone number before continuing.");
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError(
        "Enter a valid phone number (e.g. 0912345678 or +251912345678).",
      );
      return;
    }

    setPhoneError("");
    setLoading(true);

    // Store phone so AuthSync picks it up after OAuth redirect
    sessionStorage.setItem("pending_phone", phone.trim());

    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/Login`,
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a17] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a17]/90 via-[#0a1a17]/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Branding + Form */}
        <div className="text-left space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Sabhe <br />
            <span className="text-emerald-400">Furniture</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-md leading-relaxed border-l-2 border-emerald-500 pl-4">
            WHERE MODERNITY MEETS COMFORT. <br />
            REDEFINE YOUR HOME WITH PIECES THAT SPEAK.
          </p>

          {/* Phone + Google Sign-In */}
          <div className="pt-4 space-y-4 max-w-sm">
            {/* Phone Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FaPhone className="text-emerald-400" size={14} />
              </div>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleGoogleLogin()}
                placeholder="Phone number (e.g. 0912345678)"
                className="w-full bg-white/10 border border-white/20 focus:border-emerald-400 rounded-full pl-10 pr-5 py-4 text-white placeholder-gray-400 outline-none transition-colors text-sm"
              />
            </div>

            {/* Validation error */}
            {phoneError && (
              <p className="text-red-400 text-xs pl-2">{phoneError}</p>
            )}

            {/* Google OAuth Button */}
            <button
              id="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group w-full flex items-center justify-center gap-4 bg-transparent border-2 border-white/20 hover:border-emerald-400 py-4 px-8 rounded-full text-white font-medium transition-all hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaGoogle className="text-white group-hover:text-emerald-400 transition-colors" />
              )}
              <span>
                {loading ? "Redirecting to Google..." : "Continue with Google"}
              </span>
            </button>

            <p className="text-gray-500 text-xs text-center">
              Your phone number is used for order delivery updates only.
            </p>
          </div>
        </div>

        {/* Right — reserved for future content */}
        <div className="w-full max-w-md mx-auto lg:ml-auto" />
      </div>
    </div>
  );
}
