"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account, getUserProfile } from "../../lib/appwrite";
import { FaSpinner, FaUserCircle, FaShoppingCart, FaBars, FaTimes, FaSearch, FaHeart, FaBox, FaClipboardList } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check session + priority on mount / route change
  useEffect(() => {
    async function checkAuth() {
      try {
        const u = await account.get();
        setUser({ name: u.name, email: u.email });

        // Check priority flag in users collection
        const profile = await getUserProfile(u.$id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setIsAdmin((profile as any)?.priority === true);
      } catch {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAdmin(false);
      
      // Clear guest data so the next person on this device starts fresh
      localStorage.removeItem("sabhe_cart_guest");
      localStorage.removeItem("sabhe_wishlist_guest");
      
      router.push("/Login");
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const getLinkClass = (path: string, isMobile = false) => {
    const isActive = pathname === path || pathname?.startsWith(path + "/");
    if (isMobile) {
      return `hover:text-emerald-800 transition-colors ${
        isActive ? "underline underline-offset-8 decoration-2 text-emerald-900 font-bold" : "text-gray-900"
      }`;
    }
    return `hover:text-emerald-200 transition-colors ${
      isActive ? "underline underline-offset-8 decoration-2 text-emerald-100 font-bold" : ""
    }`;
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <Link href="/Products" className={getLinkClass("/Products", isMobile)}>
        Products
      </Link>
      <Link href="/Collections" className={getLinkClass("/Collections", isMobile)}>
        Collections
      </Link>
      <Link href="/About" className={getLinkClass("/About", isMobile)}>
        About Us
      </Link>

      {/* ── Admin Links ── */}
      {isAdmin && (
        <div className={`flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 border-t lg:border-t-0 ${isMobile ? "border-gray-200" : "border-emerald-800"} pt-6 lg:pt-0 mt-2 lg:mt-0 lg:ml-4`}>
          <Link 
            href="/Items" 
            className={`${getLinkClass("/Items", isMobile)} flex items-center gap-2 ${isMobile ? "text-yellow-600 hover:text-yellow-700" : "text-yellow-500 hover:text-yellow-300"} font-black italic tracking-widest`}
          >
            <FaBox size={14} className="not-italic" /> Items
          </Link>
          <Link 
            href="/Orders" 
            className={`${getLinkClass("/Orders", isMobile)} flex items-center gap-2 ${isMobile ? "text-yellow-600 hover:text-yellow-700" : "text-yellow-500 hover:text-yellow-300"} font-black italic tracking-widest`}
          >
            <FaClipboardList size={14} className="not-italic" /> Orders
          </Link>
        </div>
      )}
    </>
  );

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-4 shadow-xl sticky top-0 z-50 bg-emerald-900 text-white border-b border-emerald-800/50 backdrop-blur-md bg-opacity-95">
      
      <div className="flex items-center justify-between w-full lg:w-auto gap-6">
        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden p-2 -ml-2 text-white hover:bg-emerald-800 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter hover:text-emerald-300 transition-all duration-300 transform hover:scale-105 italic">
            SABHE<span className="text-yellow-500 not-italic">.</span>
          </h1>
        </Link>

        {/* Search Bar (Desktop) */}
        <form 
          onSubmit={handleSearch}
          className="hidden xl:flex items-center bg-emerald-800/50 border border-emerald-700/50 rounded-full px-4 py-1.5 focus-within:border-emerald-400 focus-within:bg-emerald-800 transition-all w-64 ml-4"
        >
          <input 
            type="text" 
            placeholder="Search furniture..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-white placeholder-emerald-300/50 w-full"
          />
          <button type="submit">
            <FaSearch size={12} className="text-emerald-300 hover:text-emerald-100 transition-colors" />
          </button>
        </form>

        {/* Mobile Icons */}
        <div className="lg:hidden flex items-center gap-2">
           <Link href="/Cart" className="relative p-2">
            <FaShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-emerald-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-10 font-medium text-sm tracking-wide">
        <NavLinks />
        
        <div className="h-6 w-[1px] bg-emerald-800 mx-2" />

        <div className="flex items-center gap-6">
          {/* Wishlist Icon */}
          <Link href="/Wishlist" className="relative group p-2 transition-transform hover:scale-110 active:scale-95">
            <FaHeart size={18} className={`${wishlistCount > 0 ? "text-red-400" : "text-emerald-100 group-hover:text-red-300"} transition-colors`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-emerald-900 animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link href="/Cart" className="relative group p-2 transition-transform hover:scale-110 active:scale-95">
            <FaShoppingCart size={18} className="group-hover:text-yellow-400 transition-colors text-emerald-100" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-emerald-900 animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {authLoading ? (
            <div className="flex items-center gap-2 opacity-50">
              <FaSpinner className="animate-spin" size={12} />
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-all border border-emerald-700 hover:border-emerald-500"
              >
                <FaUserCircle size={14} />
                <span className="text-xs font-bold truncate max-w-[80px]">{user.name || "Account"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 text-gray-800 animate-in fade-in slide-in-from-top-4">
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated As</p>
                    <p className="text-xs font-bold text-emerald-900 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <>
                      <Link href="/Items" className="block px-5 py-3 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors">📦 Manage Inventory</Link>
                      <Link href="/Orders" className="block px-5 py-3 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors">🧾 Processing Orders</Link>
                      <div className="border-t border-gray-100" />
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full text-left px-5 py-4 text-xs font-black text-red-500 hover:bg-red-50 uppercase tracking-widest flex items-center gap-2"
                  >
                    {loggingOut ? "Logging out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/Login" className="px-6 py-2 bg-yellow-500 text-emerald-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-all duration-500 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`fixed top-0 left-0 h-screen w-[300px] bg-white flex flex-col p-8 transform transition-transform duration-500 ease-out shadow-2xl ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-12">
             <h2 className="font-black text-2xl tracking-tighter italic text-[#0a1a17]">SABHE<span className="text-yellow-500 not-italic">.</span></h2>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
               <FaTimes size={20} />
             </button>
          </div>
          
          <form onSubmit={handleSearch} className="mb-8 relative">
             <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
             />
             <FaSearch className="absolute right-5 top-5 text-gray-400" size={14} />
          </form>

          <nav className="flex flex-col gap-8 text-xl font-black uppercase tracking-widest italic">
             <NavLinks isMobile />
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-200 flex flex-col gap-4">
             {user ? (
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <FaUserCircle size={32} className="text-emerald-800" />
                    <div>
                      <p className="font-bold text-sm text-gray-900 truncate w-40">{user.name || "User"}</p>
                      <p className="text-[10px] text-emerald-800 font-bold uppercase">{isAdmin ? "Administrator" : "Customer"}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full py-4 bg-red-500/10 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors">Sign Out</button>
               </div>
             ) : (
               <Link href="/Login" className="block w-full py-5 bg-yellow-500 text-emerald-950 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-xs">Sign In</Link>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
