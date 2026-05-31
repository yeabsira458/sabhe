"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaCheckCircle } from "react-icons/fa";
import { account, databases, DATABASE_ID, ID } from "../../lib/appwrite";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "Addis Ababa",
    phone: "",
    note: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleCheckout = async () => {
    if (!shippingInfo.address || !shippingInfo.phone) {
      setError("Please provide a shipping address and phone number.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      // 1. Get user
      let user;
      try {
        user = await account.get();
      } catch {
        router.push("/Login?redirect=/Cart");
        return;
      }

      // 2. Create Order in Appwrite (Aligning with setup-db.mjs schema)
      const ORDERS_COLLECTION_ID = "orders"; 

      await databases.createDocument(DATABASE_ID, ORDERS_COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        status: "pending",
        totalAmount: cartTotal,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        phone: shippingInfo.phone,
        paymentMethod: paymentMethod,
        note: shippingInfo.note || `Items: ${cart.map(i => `${i.productName} (x${i.quantity})`).join(", ")}`,
      });

      setOrderSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError("Failed to place order. Please try again. (Ensure 'orders' collection is active)");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8 pt-28">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <FaCheckCircle size={48} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">Order Received!</h1>
          <p className="text-gray-500 text-lg">
            Thank you for shopping with Sabhe Furniture. We'll contact you soon to finalize delivery.
          </p>
          <div className="pt-6">
            <Link 
              href="/Products" 
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-800 text-white font-bold rounded-full hover:bg-emerald-700 transition-all hover:scale-105"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-8 pt-28">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto">
            <FaShoppingBag size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500">
            Looks like you haven't added anything yet. Explore our premium collections to find the perfect piece.
          </p>
          <div className="pt-4">
            <Link 
              href="/Products" 
              className="inline-flex items-center gap-2 text-emerald-800 font-bold hover:underline"
            >
              <FaArrowLeft size={12} />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left: Cart Items */}
          <div className="flex-grow space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping <span className="text-emerald-800">Cart</span></h1>
              <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">{cart.length} Items</span>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white p-4 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg md:text-xl line-clamp-1">{item.productName}</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-mono">Ref: {item.id.slice(-6)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-emerald-800 transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-sm font-black text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-emerald-800 transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                        <p className="font-black text-emerald-800">{(item.price * item.quantity).toLocaleString()} ETB</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/Products" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-bold transition-colors">
              <FaArrowLeft size={10} />
              Continue Shopping
            </Link>
          </div>

          {/* Right: Summary */}
          <div className="w-full md:w-[380px] flex-shrink-0">
            <div className="bg-emerald-900 text-white rounded-[2.5rem] p-8 sticky top-32 shadow-2xl shadow-emerald-900/20">
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter italic">Checkout</h2>
              
              {/* Shipping Form */}
              <div className="space-y-4 mb-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-emerald-300/60 font-bold">Shipping Address</label>
                  <input 
                    type="text"
                    placeholder="Street, Building, Apartment..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-emerald-400 placeholder-emerald-100/20"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-emerald-300/60 font-bold">City</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder-emerald-100/20"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-emerald-300/60 font-bold">Phone</label>
                    <input 
                      type="tel"
                      placeholder="09..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-emerald-400 placeholder-emerald-100/20"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 mb-8">
                <label className="text-[10px] uppercase tracking-widest text-emerald-300/60 font-bold">Payment Method</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "cash", label: "Cash on Delivery", desc: "Pay upon receiving your furniture" },
                    { id: "telebirr", label: "Telebirr", desc: "Pay securely via Telebirr mobile wallet" },
                    { id: "cbe", label: "CBE (Commercial Bank)", desc: "Bank transfer via Commercial Bank of Ethiopia" },
                    { id: "abyssinia", label: "Abyssinia (BoA)", desc: "Bank transfer via Bank of Abyssinia" },
                    { id: "santimpay", label: "Santim Pay", desc: "Pay using Santim Pay payment gateway" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col text-left px-4 py-3 rounded-xl border transition-all ${
                        paymentMethod === method.id
                          ? "bg-white/10 border-emerald-400 text-white font-semibold"
                          : "bg-white/5 border-white/10 text-emerald-100/60 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span className="text-xs font-black tracking-wider uppercase flex items-center justify-between w-full">
                        {method.label}
                        {paymentMethod === method.id && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      </span>
                      <span className="text-[10px] opacity-60 mt-0.5">{method.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details / Instructions */}
              {paymentMethod !== "cash" && (
                <div className="mb-8 p-4 bg-white/5 border border-emerald-400/20 rounded-2xl text-xs space-y-2 leading-relaxed">
                  <p className="font-bold text-emerald-300 uppercase tracking-widest text-[9px]">Payment Instructions</p>
                  {paymentMethod === "telebirr" && (
                    <p className="text-emerald-100/80">
                      Please send the total amount of <span className="font-bold text-white">{cartTotal.toLocaleString()} ETB</span> to our Telebirr merchant number: <span className="font-mono font-bold text-white text-sm block mt-1">0911223344</span> and add your phone number in the transaction note.
                    </p>
                  )}
                  {paymentMethod === "cbe" && (
                    <p className="text-emerald-100/80">
                      Please transfer the total amount of <span className="font-bold text-white">{cartTotal.toLocaleString()} ETB</span> to our Commercial Bank of Ethiopia (CBE) account: <span className="font-mono font-bold text-white text-sm block mt-1">1000123456789</span> Account Name: <span className="text-white font-semibold">Sabhe Furniture</span>.
                    </p>
                  )}
                  {paymentMethod === "abyssinia" && (
                    <p className="text-emerald-100/80">
                      Please transfer the total amount of <span className="font-bold text-white">{cartTotal.toLocaleString()} ETB</span> to our Bank of Abyssinia account: <span className="font-mono font-bold text-white text-sm block mt-1">987654321</span> Account Name: <span className="text-white font-semibold">Sabhe Furniture</span>.
                    </p>
                  )}
                  {paymentMethod === "santimpay" && (
                    <p className="text-emerald-100/80">
                      You will pay <span className="font-bold text-white">{cartTotal.toLocaleString()} ETB</span> using Santim Pay gateway. We will contact you with a payment link to complete the secure payment.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-emerald-200/60 text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono">{cartTotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-emerald-200/60 text-sm">
                  <span>Delivery</span>
                  <span className="font-mono">FREE</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-emerald-100 text-lg">Total</span>
                  <span className="text-3xl font-black">{cartTotal.toLocaleString()} <span className="text-xs font-normal opacity-60">ETB</span></span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-xs text-center leading-relaxed">
                  {error}
                </div>
              )}

              <button
                disabled={submitting}
                onClick={handleCheckout}
                className="w-full bg-white text-emerald-900 hover:bg-emerald-50 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <FaCheckCircle size={14} />
                  </>
                )}
              </button>

              <p className="mt-6 text-[10px] text-center text-emerald-200/40 uppercase tracking-widest leading-loose">
                Payment: {paymentMethod === "cash" ? "Cash on Delivery" : paymentMethod === "telebirr" ? "Telebirr Wallet" : paymentMethod === "cbe" ? "CBE Transfer" : paymentMethod === "abyssinia" ? "Abyssinia Transfer" : "Santim Pay Gateway"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
