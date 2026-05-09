"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  account, databases, storage,
  DATABASE_ID, PRODUCTS_COLLECTION_ID, PRODUCT_IMAGES_BUCKET_ID,
  getUserProfile, getCategories,
  ID, AppwriteCategory,
} from "@/lib/appwrite";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductRow = {
  $id: string;
  productName: string;
  price: number;
  category: string;
  inStock: boolean;
  featured: boolean;
  image: string;
};

// ─── Empty form using EXACT attribute names required by the DB ─────────────────
const EMPTY_FORM = {
  title:       "",   // String — product name
  description: "",   // String — product details
  price:       0,    // Integer/Float — in ETB
  category:    "",   // String — must match category slug exactly
  featured:    false,// Boolean
  inStock:     true, // Boolean
  discount:    0,    // Integer — percentage
  rating:      5,    // Float
};

export default function ItemsPage() {
  const router = useRouter();
  const [isAdmin,    setIsAdmin]    = useState(false);
  const [pageLoad,   setPageLoad]   = useState(true);
  const [categories, setCategories] = useState<AppwriteCategory[]>([]);
  const [products,   setProducts]   = useState<ProductRow[]>([]);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function checkAccess() {
      try {
        const u = await account.get();
        const profile = await getUserProfile(u.$id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (profile && (profile as any).priority === true) {
          setIsAdmin(true);
          loadCategories();
          loadProducts();
        } else {
          router.push("/");
        }
      } catch {
        router.push("/Login");
      } finally {
        setPageLoad(false);
      }
    }
    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ── Load categories for the dropdown ───────────────────────────────────────
  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setFormData((f) => ({ ...f, category: (cats[0].categoryName || "").toLowerCase() }));
      }
    } catch (e) { console.error(e); }
  }

  // ── Load product list ───────────────────────────────────────────────────────
  async function loadProducts() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
      setProducts(res.documents as unknown as ProductRow[]);
    } catch (e) { console.error(e); }
  }

  // ── Image preview when file selected ───────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview("");
  };

  // ── Submit: upload image → save product ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      // 1. Upload image to Appwrite Storage bucket 69fddb13000e96d29eac
      let imageUrl = "";
      if (imageFile) {
        const uploaded = await storage.createFile(
          PRODUCT_IMAGES_BUCKET_ID,   // "69fddb13000e96d29eac"
          ID.unique(),
          imageFile,
        );
        // getFileView returns a URL string pointing to the stored file
        imageUrl = storage
          .getFileView(PRODUCT_IMAGES_BUCKET_ID, uploaded.$id)
          .toString();
      }

      // 2. Save product document using EXACT attribute names
      await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          productName: formData.title,
          description: formData.description,
          price:       formData.price,
          image:       imageUrl,        // URL from storage bucket
          category:    formData.category, // slug from categories collection
          featured:    formData.featured,
          inStock:     formData.inStock,
          discount:    formData.discount,
          rating:      formData.rating,
        },
      );

      setSuccess(`✅ "${formData.title}" added to inventory!`);
      setFormData(EMPTY_FORM);
      setImageFile(null);
      setPreview("");
      loadProducts();

    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Unknown error — check console.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle stock ───────────────────────────────────────────────────────────
  const toggleStock = async (id: string, current: boolean) => {
    await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id, { inStock: !current });
    loadProducts();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteItem = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
    loadProducts();
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (pageLoad) return (
    <div className="min-h-screen bg-[#0a1a17] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Verifying admin access…</p>
      </div>
    </div>
  );
  if (!isAdmin) return null;

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a1a17] pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-4xl font-black text-white">
              Manage <span className="text-emerald-400">Items</span>
            </h1>
          </div>
          <Link href="/Orders" className="text-sm text-yellow-400 hover:underline">
            View Orders →
          </Link>
        </div>

        {/* ── ADD ITEM FORM ── */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6">Add New Product</h2>

          {success && (
            <div className="mb-5 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-5 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1: Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  placeholder="e.g. Velvet Royal Sofa"
                  value={formData.title}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-600"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Category Slug <span className="text-red-400">*</span>
                </label>
                {categories.length > 0 ? (
                  <select
                    required
                    value={formData.category}
                    className="w-full bg-[#1a2e2a] border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">— Select category —</option>
                    {categories.map((c) => {
                      const catName = c.categoryName || "Unknown";
                      return (
                        <option key={c.$id} value={catName.toLowerCase()}>
                          {catName}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    required
                    placeholder="e.g. sofa (exact slug from categories)"
                    value={formData.category}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-600"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                )}
              </div>
            </div>

            {/* Row 2: Price / Discount / Rating */}
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Price (ETB) <span className="text-red-400">*</span>
                </label>
                <input
                  required type="number" min={0} step="0.01"
                  placeholder="e.g. 12500"
                  value={formData.price || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-600"
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Discount (%)</label>
                <input
                  type="number" min={0} max={100}
                  placeholder="0"
                  value={formData.discount || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none placeholder-gray-600"
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rating (1–5)</label>
                <input
                  type="number" min={1} max={5} step="0.1"
                  value={formData.rating}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none placeholder-gray-600"
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed product description…"
                value={formData.description}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none placeholder-gray-600"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-8">
              <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                <input
                  type="checkbox" checked={formData.inStock}
                  className="accent-emerald-500 w-4 h-4"
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                <input
                  type="checkbox" checked={formData.featured}
                  className="accent-emerald-500 w-4 h-4"
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured (shown on homepage)
              </label>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Product Image <span className="text-gray-500">(uploads to Appwrite Storage)</span>
              </label>
              <input
                type="file" accept="image/*"
                className="w-full text-gray-400 file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-500 file:text-[#0a1a17] hover:file:bg-emerald-400 transition-all cursor-pointer"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="mt-3 flex items-start gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded-xl border border-white/10"
                  />
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>📁 {imageFile?.name}</p>
                    <p>📦 Bucket: <span className="text-emerald-400 font-mono">69fddb13000e96d29eac</span></p>
                    <p className="text-gray-600">URL will be saved to <span className="text-white font-mono">image</span> attribute</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-[#0a1a17] font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a1a17] border-t-transparent rounded-full animate-spin" />
                  Uploading & Saving…
                </span>
              ) : "Add to Sabhe Inventory"}
            </button>
          </form>
        </div>

        {/* ── INVENTORY TABLE ── */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Inventory{" "}
              <span className="text-emerald-400 text-sm font-normal">({products.length} products)</span>
            </h2>
            <button
              onClick={loadProducts}
              className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.$id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {p.image
                        ? <img src={p.image} alt={p.productName} className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                        : <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-gray-600 text-xs">No img</div>
                      }
                    </td>
                    <td className="px-6 py-4 text-white font-medium max-w-[180px] truncate">{p.productName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded-lg text-gray-300 font-mono text-xs">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{p.price.toLocaleString()} ETB</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.featured ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-gray-500"}`}>
                        {p.featured ? "⭐ Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStock(p.$id, p.inStock)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          p.inStock
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/40"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteItem(p.$id, p.productName)}
                        className="text-red-500 hover:text-red-400 text-xs font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                      No products yet. Add your first item above.
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
