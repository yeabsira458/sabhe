"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account, getUserProfile } from "../../lib/appwrite";
import { FaSpinner, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAdmin(false);
      router.push("/Login");
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(path + "/");
    return `hover:text-emerald-200 transition-colors ${
      isActive ? "underline underline-offset-8 decoration-2 text-emerald-100" : ""
    }`;
  };

  const NavLinks = () => (
    <>
      <Link href="/Products" className={getLinkClass("/Products")}>
        Products
      </Link>
      <Link href="/Collections" className={getLinkClass("/Collections")}>
        Collections
      </Link>
      <Link href="/About" className={getLinkClass("/About")}>
        About Us
      </Link>

      {isAdmin && (
        <>
          <Link
            href="/Items"
            className={`${getLinkClass("/Items")} flex items-center gap-1 text-yellow-300 hover:text-yellow-200`}
          >
            Items
          </Link>
          <Link
            href="/Orders"
            className={`${getLinkClass("/Orders")} flex items-center gap-1 text-yellow-300 hover:text-yellow-200`}
          >
            Orders
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 shadow-sm sticky top-0 z-50 bg-emerald-800 text-white transition-all duration-300">
      
      {/* ── Mobile Menu Trigger ── */}
      <button 
        className="lg:hidden p-2 -ml-2 text-white hover:bg-emerald-700 rounded-lg transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* ── Logo ── */}
      <Link href="/" className="flex-1 lg:flex-none">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight hover:text-emerald-100 transition-colors truncate">
          SABHE <span className="hidden sm:inline">FURNITURE</span>
        </h1>
      </Link>

      {/* ── Desktop Nav ── */}
      <nav className="hidden lg:flex items-center gap-8 font-medium">
        <NavLinks />
        
        {/* Cart Icon */}
        <Link href="/Cart" className="relative group p-2 ml-2 transition-transform hover:scale-110 active:scale-95">
          <FaShoppingCart size={22} className="group-hover:text-emerald-100" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-emerald-800 shadow-lg animate-in zoom-in duration-300">
              {itemCount}
            </span>
          )}
        </Link>

        {/* Auth area */}
        {authLoading ? (
          <div className="ml-4 px-6 py-2 rounded-full border border-emerald-600 flex items-center gap-2 opacity-60">
            <FaSpinner className="animate-spin" size={13} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : user ? (
          <div className="relative ml-4">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-colors border border-emerald-600 shadow-sm"
            >
              <FaUserCircle size={16} />
              <span className="text-sm font-semibold max-w-[120px] truncate">
                {user.name || user.email}
              </span>
              <span className="text-emerald-300 text-xs">▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-gray-800 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                {isAdmin && (
                   <Link href="/Items" className="block px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50">Manage Items</Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/Login" className="ml-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-colors border border-emerald-600 shadow-sm">
            Login
          </Link>
        )}
      </nav>

      {/* ── Mobile Toolbar (Cart) ── */}
      <div className="lg:hidden flex items-center gap-4">
        <Link href="/Cart" className="relative p-2">
          <FaShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-emerald-800">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[59] lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-emerald-900 z-[60] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
             <h2 className="font-bold text-xl tracking-tighter">SABHE</h2>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-emerald-800 rounded-full">
               <FaTimes size={20} />
             </button>
          </div>
          
          <nav className="flex flex-col gap-6 text-lg font-medium">
             <NavLinks />
          </nav>

          <div className="mt-auto pt-8 border-t border-emerald-800">
             {user ? (
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <FaUserCircle size={24} className="text-emerald-300" />
                   <div>
                     <p className="font-bold text-sm truncate w-40">{user.name || user.email}</p>
                     <p className="text-xs text-emerald-400">{user.email}</p>
                   </div>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-600/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-600/30 transition-colors"
                 >
                   Sign Out
                 </button>
               </div>
             ) : (
               <Link href="/Login" className="block w-full py-3 bg-emerald-700 text-white rounded-xl text-center font-bold">
                 Login
               </Link>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
