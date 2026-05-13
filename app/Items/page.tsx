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
import { FaPlus, FaTrash, FaSpinner, FaMagic, FaImage } from "react-icons/fa";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductRow = {
  $id: string;
  productName: string;
  price: number;
  category: string;
  inStock: boolean;
  featured: boolean;
  image: string;
  gallery?: string[];
  description: string;
};

const EMPTY_FORM = {
  title:       "",   
  description: "",   
  price:       0,    
  category:    "",   
  featured:    false,
  inStock:     true, 
  discount:    0,    
  rating:      5,    
};

export default function ItemsPage() {
  const router = useRouter();
  const [isAdmin,    setIsAdmin]    = useState(false);
  const [pageLoad,   setPageLoad]   = useState(true);
  const [categories, setCategories] = useState<AppwriteCategory[]>([]);
  const [products,   setProducts]   = useState<ProductRow[]>([]);
  const [formData,   setFormData]   = useState(EMPTY_FORM);
  
  // Multiple Images State
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [previews, setPreviews] = useState<string[]>(["", "", "", ""]);
  
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const u = await account.get();
        const profile = await getUserProfile(u.$id);
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
  }, [router]);

  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setFormData((f) => ({ ...f, category: (cats[0].categoryName || "").toLowerCase() }));
      }
    } catch (e) { console.error(e); }
  }

  async function loadProducts() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
      setProducts(res.documents as unknown as ProductRow[]);
    } catch (e) { console.error(e); }
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...previews];
    if (file) newPreviews[index] = URL.createObjectURL(file);
    else newPreviews[index] = "";
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews[index] = "";
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!imageFiles[0]) {
      setError("Please upload at least the main product photo (Image 1).");
      setSubmitting(false);
      return;
    }

    try {
      // 1. Upload all selected images
      const uploadPromises = imageFiles.map(async (file) => {
        if (!file) return null;
        const uploaded = await storage.createFile(PRODUCT_IMAGES_BUCKET_ID, ID.unique(), file);
        return storage.getFileView(PRODUCT_IMAGES_BUCKET_ID, uploaded.$id).toString();
      });

      const urls = await Promise.all(uploadPromises);
      const mainImage = urls[0];
      const gallery = urls.filter((url, idx) => url !== null && idx > 0) as string[];

      // 2. Create document
      await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        {
          productName: formData.title,
          // SMART HACK: Store gallery in description as hidden metadata if 'gallery' attribute is missing
          description: `${formData.description}\n\n<!--GALLERY:${JSON.stringify(gallery)}-->`,
          price:       formData.price,
          image:       mainImage,
          category:    formData.category,
          featured:    formData.featured,
          inStock:     formData.inStock,
          discount:    formData.discount,
          rating:      formData.rating,
        },
      );

      setSuccess(`✅ "${formData.title}" added with ${gallery.length + 1} images!`);
      setFormData(EMPTY_FORM);
      setImageFiles([null, null, null, null]);
      setPreviews(["", "", "", ""]);
      loadProducts();

    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Submission failed. Ensure 'gallery' attribute exists in Appwrite.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStock = async (id: string, current: boolean) => {
    await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id, { inStock: !current });
    loadProducts();
  };

  const deleteItem = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
    loadProducts();
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      setError("Please enter a Title first.");
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: formData.title, category: formData.category })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormData(prev => ({ ...prev, title: data.headline, description: data.description }));
      setSuccess("✨ AI Details Generated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (pageLoad) return (
    <div className="min-h-screen bg-[#0a1a17] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a1a17] pt-28 pb-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">
              INVENTORY <span className="text-emerald-400 not-italic">HUB</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Sabhe Furniture Management</p>
          </div>
          <Link href="/Orders" className="bg-emerald-800/30 text-emerald-400 px-6 py-2 rounded-full text-xs font-bold border border-emerald-800/50 hover:bg-emerald-800/50 transition-all">
            View Orders →
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Add New Collection Piece</h2>
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-emerald-500 text-[#0a1a17] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                  AI Generate
                </button>
              </div>

              {success && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold"> {success} </div>}
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"> {error} </div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
                    <input 
                      required 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Minimalist Oak Chair"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#112420] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-400 outline-none transition-all appearance-none"
                    >
                      {categories.map(c => <option key={c.$id} value={c.categoryName?.toLowerCase()}>{c.categoryName}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (ETB)</label>
                    <input 
                      type="number" required
                      value={formData.price || ""}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Discount %</label>
                    <input 
                      type="number"
                      value={formData.discount || ""}
                      onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Rating</label>
                    <input 
                      type="number" step="0.1" max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the soul of this piece..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* Multiple Images Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Showcase (Up to 4 Images)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((_, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center overflow-hidden">
                        {previews[idx] ? (
                          <>
                            <img src={previews[idx]} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-all"
                            >
                              <FaTrash size={10} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-[#0a1a17] text-[8px] font-black text-center py-1 uppercase tracking-widest">
                              {idx === 0 ? "Main Photo" : `Angle ${idx + 1}`}
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                            <FaImage size={24} className="text-gray-600" />
                            <span className="text-[8px] font-black text-gray-500 uppercase text-center">{idx === 0 ? "Main Image" : "Add Angle"}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFileChange(idx, e)} 
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-600 italic">* The first image will be used as the primary display thumbnail.</p>
                </div>

                <div className="flex gap-6 pt-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-5 h-5 rounded-lg bg-white/5 border-white/10 accent-emerald-500" 
                      />
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Featured Item</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" checked={formData.inStock}
                        onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                        className="w-5 h-5 rounded-lg bg-white/5 border-white/10 accent-emerald-500" 
                      />
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">In Stock</span>
                   </label>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a1a17] py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                  {submitting ? "Synchronizing with DB..." : "Commit to Inventory"}
                </button>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center justify-between">
                Live Inventory
                <span className="bg-emerald-900 text-emerald-400 px-3 py-1 rounded-lg text-[10px]">{products.length} Items</span>
              </h3>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-900">
                {products.map(p => (
                  <div key={p.$id} className="group bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl hover:bg-white/[0.05] transition-all">
                    <div className="flex gap-4">
                      <img src={p.image} alt={p.productName} className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-white truncate w-40">{p.productName}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{p.category}</p>
                        <p className="text-xs font-black text-emerald-400 mt-2">{p.price.toLocaleString()} ETB</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => toggleStock(p.$id, p.inStock)} className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400">
                         {p.inStock ? "Active" : "OOS"}
                       </button>
                       <button onClick={() => deleteItem(p.$id, p.productName)} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
