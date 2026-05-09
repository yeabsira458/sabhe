"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  account, databases, DATABASE_ID, ORDERS_COLLECTION_ID,
  getUserProfile, Query,
} from "@/lib/appwrite";

type Order = {
  $id: string;
  $createdAt: string;
  userId?: string;
  status: string;
  totalAmount: number;
  items?: string;
  address?: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped:   "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const u = await account.get();
        const profile = await getUserProfile(u.$id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (profile && (profile as any).priority === true) {
          setIsAdmin(true);
          loadOrders();
        } else {
          router.push("/");
        }
      } catch {
        router.push("/Login");
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadOrders() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrders(res.documents as any);
    } catch (e) {
      console.error("loadOrders error:", e);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await databases.updateDocument(DATABASE_ID, ORDERS_COLLECTION_ID, id, { status });
      setOrders((prev) => prev.map((o) => (o.$id === id ? { ...o, status } : o)));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.totalAmount || 0), 0),
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a1a17] flex items-center justify-center text-white text-xl">
      Verifying access…
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a1a17] pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-4xl font-black text-white">
              Manage <span className="text-emerald-400">Orders</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/Items" className="text-sm text-yellow-400 hover:underline">← Manage Items</Link>
            <Link href="/admin" className="text-sm text-emerald-400 hover:underline">Add Item</Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Total Orders", value: stats.total, color: "text-white" },
            { label: "Pending", value: stats.pending, color: "text-yellow-400" },
            { label: "Delivered", value: stats.delivered, color: "text-emerald-400" },
            { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-3">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                filter === s
                  ? "bg-emerald-500 text-[#0a1a17]"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              {s === "all" ? `All (${orders.length})` : s}
            </button>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.$id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                      #{order.$id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.$createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      {order.userId ? order.userId.slice(-8) : "—"}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">
                      ${(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || "bg-gray-500/20 text-gray-400"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updating === order.$id}
                        onChange={(e) => updateStatus(order.$id, e.target.value)}
                        className="bg-[#1a2e2a] border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      {filter === "all" ? "No orders yet." : `No ${filter} orders.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
