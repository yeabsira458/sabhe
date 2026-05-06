"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

const collection = [
  {
    id: 1,
    title: "Dining Table",
    image: "https://images.unsplash.com/photo-1617806118233-18e1c0945620?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Elegant wooden craft.",
  },
  {
    id: 2,
    title: "Sofa",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Comfortable modern living.",
  },
  {
    id: 3,
    title: "Chair",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Ergonomic and stylish.",
  },
  {
    id: 4,
    title: "Bedside Table",
    image: "https://images.unsplash.com/photo-1532372576444-ea95f036c196?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Compact storage.",
  },
  {
    id: 5,
    title: "Wardrobe",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Organized storage.",
  },
  {
    id: 6,
    title: "Kitchen Set",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Modern kitchen design.",
  },
  {
    id: 7,
    title: "Coffee Table",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Perfect living room centerpiece.",
  },
  {
    id: 8,
    title: "Bookshelf",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Stylish display and storage.",
  },
  {
    id: 9,
    title: "Dresser",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Spacious bedroom organization.",
  },
  {
    id: 10,
    title: "TV Stand",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=300",
    desc: "Modern entertainment center.",
  },
];

function Slider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

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
          <h2 className="text-3xl font-extrabold text-fuchsia-950 tracking-tight">Featured Collection</h2>
          <p className="text-gray-500 mt-2">Discover our beautifully crafted furniture pieces.</p>
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
        
        {collection.map((item, index) => (
          <div
            key={index}
            className="group flex-shrink-0 w-[280px] sm:w-[320px] snap-center bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-fuchsia-100/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
          >
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Quick View Button on Hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <button className="bg-white/90 backdrop-blur-sm text-fuchsia-900 px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:bg-fuchsia-600 hover:text-white transition-colors">
                  Quick View
                </button>
              </div>
            </div>

            <div className="p-6 relative bg-white">
              <h2 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-fuchsia-600 transition-colors duration-300">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
              
              {/* Animated Bottom Line */}
              <div className="h-0.5 w-0 bg-fuchsia-500 mt-5 transition-all duration-500 group-hover:w-full rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Progress Track */}
      <div className="px-8 md:px-16 pt-2 pb-8">
        <div className="flex items-center gap-4">
          {/* Left icon hint */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-fuchsia-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>

          {/* Track */}
          <div
            ref={trackRef}
            onClick={onTrackClick}
            className="relative flex-1 h-[6px] bg-fuchsia-100 rounded-full cursor-pointer group/track"
          >
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${(scrollProgress * 75) + 25}%` }}
            />
            {/* Draggable Thumb */}
            <div
              onMouseDown={onThumbMouseDown}
              className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border-2 border-fuchsia-500 rounded-full shadow-[0_2px_8px_rgba(192,38,211,0.4)] cursor-grab active:cursor-grabbing transition-all duration-150 ease-out hover:scale-125 hover:border-fuchsia-600 hover:shadow-[0_4px_12px_rgba(192,38,211,0.5)]"
              style={{
                left: `calc(${scrollProgress * 75}% + 0%)`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>

          {/* Right icon hint */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-fuchsia-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>

        {/* Helper label */}
        <p className="text-center text-xs text-fuchsia-300 mt-3 tracking-wider font-medium select-none">
          drag to explore &nbsp;·&nbsp; {collection.length} items
        </p>
      </div>

    </div>
  );
}

export default Slider;
