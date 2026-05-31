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
import { FaPlus, FaSpinner, FaMagic, FaImage, FaEye, FaEyeSlash, FaBoxOpen } from "react-icons/fa";

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

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...previews];
    if (file) {
      // Basic validation
      console.log(`Selected file: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);
      
      if (file.size > 25 * 1024 * 1024) { // 25MB limit for safety
        setError(`File "${file.name}" is too large. Max size is 25MB.`);
        return;
      }

      try {
        let finalFile = file;
        const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');
        
        if (index === 0 && isVideo) {
          setError("Image 1 MUST be a photo (no videos). Please use Image 2, 3, or 4 for video angles.");
          return;
        }

        if (isHeic) {
          setSuccess(`Converting HEIC "${file.name}" to JPG...`);
          const heic2anyModule = await import("heic2any");
          const heic2any = heic2anyModule.default || heic2anyModule;
          const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
          const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
          finalFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
          
          // Update the actual file in state so it uploads as JPG
          const updatedFiles = [...imageFiles];
          updatedFiles[index] = finalFile;
          setImageFiles(updatedFiles);
        }

        if (isVideo) {
          newPreviews[index] = URL.createObjectURL(finalFile);
          setSuccess(`Video "${finalFile.name}" selected!`);
        } else {
          const base64 = await getBase64(finalFile);
          newPreviews[index] = base64;
          setSuccess(`Photo "${finalFile.name}" ready!`);
        }
      } catch (err) {
        console.error("File processing error", err);
        setError(`Failed to process "${file.name}". Try a different photo.`);
      }
    } else {
      newPreviews[index] = "";
    }
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
        // Manually construct the URL to ensure it's persistent and absolute
        // This avoids SDK-specific URL generation issues and ensures the project ID is always present.
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
        const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69fad27100189847d507";
        return `${endpoint}/storage/buckets/${PRODUCT_IMAGES_BUCKET_ID}/files/${uploaded.$id}/view?project=${project}`;
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
          // Sync to BOTH gallery attribute and description metadata for maximum compatibility
          gallery:     gallery,
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
      setError(err instanceof Error ? err.message : "Submission failed. Please check your internet or Appwrite bucket permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  // Soft-hide: sets inStock=false to hide from clients without deleting from DB
  const toggleVisibility = async (id: string, currentlyVisible: boolean) => {
    await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id, { inStock: !currentlyVisible });
    loadProducts();
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      setError("Please enter a basic Product Title first so AI knows what to focus on.");
      return;
    }
    setIsGenerating(true);
    setError("");
    setSuccess("");
    try {
      // User requested to send ONLY the main photo (Image 1) to AI
      const mainPhotoBase64 = previews[0];
      if (!mainPhotoBase64 || mainPhotoBase64.startsWith("blob:")) {
        setError("Please upload a Main Photo (Image 1) first so AI can see it.");
        return;
      }

      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productName: formData.title, 
          category: formData.category, 
          imagesBase64: [mainPhotoBase64] // Only send the first photo
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormData(prev => ({ ...prev, title: data.headline, description: data.description }));
      setSuccess("✨ AI Masterpiece Created using your photos!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed.");
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

        <div className="space-y-10">

          {/* ── Add New Collection Piece Form (full width) ── */}
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
                            {previews[idx].startsWith("blob:") ? (
                              <video src={previews[idx]} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            ) : (
                              <img src={previews[idx]} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-all text-xs font-black leading-none"
                            >
                              -
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
                              accept={idx === 0 ? "image/*, .png, .jpg, .jpeg, .webp, .heic, .heif" : "image/*, video/*, .png, .jpg, .jpeg, .webp, .heic, .heif, .mov, .mp4"} 
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
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Visible to Customers</span>
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

          {/* ── Live Inventory (below form, full width) ── */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FaBoxOpen className="text-emerald-400" size={20} />
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Live Inventory</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Visible
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block ml-3" />
                  Hidden
                </div>
                <span className="bg-emerald-900/60 text-emerald-400 px-4 py-1.5 rounded-xl text-[10px] font-black border border-emerald-800/50">
                  {products.length} Items
                </span>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <FaBoxOpen size={40} className="mb-4 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-widest">No items yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map(p => (
                  <div
                    key={p.$id}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                      p.inStock
                        ? "border-white/10 bg-white/[0.03] hover:border-emerald-800"
                        : "border-orange-500/20 bg-orange-500/[0.03] hover:border-orange-500/40"
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.productName}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          !p.inStock ? "opacity-40 grayscale" : ""
                        }`}
                      />
                      {/* Visibility badge */}
                      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        p.inStock
                          ? "bg-emerald-500/90 text-[#0a1a17]"
                          : "bg-orange-500/90 text-white"
                      }`}>
                        {p.inStock ? <FaEye size={8} /> : <FaEyeSlash size={8} />}
                        {p.inStock ? "Visible" : "Hidden"}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <h4 className="text-[11px] font-bold text-white leading-tight line-clamp-2 mb-1">{p.productName}</h4>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">{p.category}</p>
                      <p className="text-xs font-black text-emerald-400">{p.price.toLocaleString()} ETB</p>
                    </div>

                    {/* Action — appears on hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/70 backdrop-blur-sm">
                      <button
                        onClick={() => toggleVisibility(p.$id, p.inStock)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          p.inStock
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 border border-orange-500/30"
                            : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 border border-emerald-500/30"
                        }`}
                      >
                        {p.inStock ? <><FaEyeSlash size={10} /> Hide from Shop</> : <><FaEye size={10} /> Show in Shop</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
