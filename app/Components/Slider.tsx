"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getCategories, getProducts, AppwriteCategory, AppwriteProduct } from "../../lib/appwrite";

function CategoryCard({ 
  category, 
  products 
}: { 
  category: AppwriteCategory; 
  products: AppwriteProduct[] 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products that belong to this category and have images
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.categoryName.toLowerCase() && p.image
  );

  useEffect(() => {
    if (categoryProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categoryProducts.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [categoryProducts.length]);

  const displayImage = categoryProducts.length > 0 
    ? categoryProducts[currentIndex].image 
    : (category.iconUrl || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800");

  return (
    <Link
      href={`/Products/${category.categoryName.toLowerCase()}`}
      className="group flex-shrink-0 w-[280px] sm:w-[320px] snap-center bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-fuchsia-100/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <img
          key={displayImage}
          src={displayImage}
          alt={category.categoryName}
          className="h-full w-full object-cover transition-all duration-1000 animate-in fade-in zoom-in-110 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Action Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <div className="bg-white/90 backdrop-blur-sm text-fuchsia-900 px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:bg-fuchsia-600 hover:text-white transition-colors">
            Explore Collection
          </div>
        </div>
      </div>

      <div className="p-6 relative bg-white">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-fuchsia-600 transition-colors duration-300">
            {category.categoryName}
          </h2>
          <span className="bg-fuchsia-50 text-fuchsia-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {categoryProducts.length} Items
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {category.description || `Explore our high-quality selection of ${category.categoryName.toLowerCase()} furniture.`}
        </p>
        
        <div className="h-0.5 w-0 bg-fuchsia-500 mt-5 transition-all duration-500 group-hover:w-full rounded-full"></div>
      </div>
    </Link>
  );
}

function Slider() {
  const [categories, setCategories] = useState<AppwriteCategory[]>([]);
  const [products, setProducts] = useState<AppwriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Failed to fetch data for slider:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update thumb position when cards scroll
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Drag the thumb to scroll cards
  const onThumbMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollContainerRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const track = trackRef.current;
      const el = scrollContainerRef.current;
      if (!track || !el) return;
      const trackWidth = track.clientWidth;
      const thumbWidth = trackWidth * 0.25;
      const maxThumbLeft = trackWidth - thumbWidth;
      const dx = e.clientX - dragStartX.current;
      const ratio = dx / maxThumbLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = dragStartScroll.current + ratio * maxScroll;
    };
    const onMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Click on track to jump
  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const el = scrollContainerRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const thumbWidth = rect.width * 0.25;
    const clickX = e.clientX - rect.left - thumbWidth / 2;
    const maxLeft = rect.width - thumbWidth;
    const ratio = Math.max(0, Math.min(1, clickX / maxLeft));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-[500px] bg-gradient-to-br from-fuchsia-50 to-white py-16 overflow-hidden">
      
      <div className="flex justify-between items-end px-8 md:px-16 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-fuchsia-950 tracking-tight">Browse by Category</h2>
          <p className="text-gray-500 mt-2">Discover our curated furniture collections.</p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md text-fuchsia-700 hover:bg-fuchsia-600 hover:text-white transition-all duration-300 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md text-fuchsia-700 hover:bg-fuchsia-600 hover:text-white transition-all duration-300 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Container for the sliding track */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 px-8 md:px-16 pb-12 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-[400px] bg-gray-100 rounded-3xl animate-pulse" />
          ))
        ) : categories.length === 0 ? (
          <div className="w-full text-center py-20 text-gray-400">
            No categories found in the database.
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard 
              key={category.$id} 
              category={category} 
              products={products} 
            />
          ))
        )}
      </div>

      {/* Scroll Progress Track */}
      <div className="px-8 md:px-16 pt-2 pb-8">
        <div className="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-fuchsia-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>

          <div
            ref={trackRef}
            onClick={onTrackClick}
            className="relative flex-1 h-[6px] bg-fuchsia-100 rounded-full cursor-pointer group/track"
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${(scrollProgress * 75) + 25}%` }}
            />
            <div
              onMouseDown={onThumbMouseDown}
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border-2 border-fuchsia-500 rounded-full shadow-[0_2px_8px_rgba(192,38,211,0.4)] cursor-grab active:cursor-grabbing transition-all duration-150 ease-out hover:scale-125 hover:border-fuchsia-600 hover:shadow-[0_4px_12px_rgba(192,38,211,0.5)]"
              style={{
                left: `calc(${scrollProgress * 75}% + 0%)`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-fuchsia-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>

        <p className="text-center text-xs text-fuchsia-300 mt-3 tracking-wider font-medium select-none">
          drag to explore &nbsp;·&nbsp; {categories.length} Collections
        </p>
      </div>

    </div>
  );
}

export default Slider;
