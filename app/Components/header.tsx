"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account, getUserProfile } from "../../lib/appwrite";
import { FaSpinner, FaUserCircle, FaShoppingCart } from "react-icons/fa";
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

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 z-50 bg-emerald-800 text-white">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight hover:text-emerald-100 transition-colors">
          SABHE FURNITURE STORE
        </h1>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-8 font-medium">
        <Link href="/Products" className={getLinkClass("/Products")}>
          Products
        </Link>
        <Link href="/Collections" className={getLinkClass("/Collections")}>
          Collections
        </Link>
        <Link href="/About" className={getLinkClass("/About")}>
          About Us
        </Link>

        {/* ── Admin-only links ── */}
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

        {/* ── Cart Icon ── */}
        <Link href="/Cart" className="relative group p-2 ml-2 transition-transform hover:scale-110 active:scale-95">
          <FaShoppingCart size={22} className="group-hover:text-emerald-100" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-emerald-800 shadow-lg animate-in zoom-in duration-300">
              {itemCount}
            </span>
          )}
        </Link>

        {/* Auth button area */}
        {authLoading ? (
          <div className="ml-4 px-6 py-2 rounded-full border border-emerald-600 flex items-center gap-2 opacity-60">
            <FaSpinner className="animate-spin" size={13} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : user ? (
          /* ── Logged in: show user name + dropdown ── */
          <div className="relative ml-4">
            <button
              id="user-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-colors border border-emerald-600 shadow-sm"
            >
              <FaUserCircle size={16} />
              <span className="text-sm font-semibold max-w-[120px] truncate">
                {user.name || user.email}
              </span>
              <span className="text-emerald-300 text-xs">▾</span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-gray-800">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  {isAdmin && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                      🛡️ Admin
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <>
                    <Link
                      href="/Items"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
                    >
                      📦 Manage Items
                    </Link>
                    <Link
                      href="/Orders"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
                    >
                      🧾 View Orders
                    </Link>
                    <div className="border-t border-gray-100" />
                  </>
                )}

                <button
                  id="logout-btn"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {loggingOut ? <FaSpinner className="animate-spin" size={12} /> : null}
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Not logged in: Login button ── */
          <Link
            id="login-btn"
            href="/Login"
            className="ml-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-colors border border-emerald-600 shadow-sm"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
