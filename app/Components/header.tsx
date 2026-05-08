"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Client, Account } from "appwrite";
import { FaSpinner, FaUserCircle } from "react-icons/fa";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69fad27100189847d507");

const account = new Account(client);

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check session on mount
  useEffect(() => {
    account
      .get()
      .then((u) => setUser({ name: u.name, email: u.email }))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, [pathname]); // re-check whenever route changes (catches post-OAuth redirect)

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      router.push("/Login");
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
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
        <Link href="/Contact" className={getLinkClass("/Contact")}>
          Contact
        </Link>

        {/* Auth button area */}
        {authLoading ? (
          <div className="ml-4 px-6 py-2 rounded-full border border-emerald-600 flex items-center gap-2 opacity-60">
            <FaSpinner className="animate-spin" size={13} />
            <span className="text-sm">Loading...</span>
          </div>
        ) : user ? (
          /* ── Logged in: show user name + logout ── */
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-gray-800">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
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
