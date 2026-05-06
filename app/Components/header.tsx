"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `hover:text-emerald-200 transition-colors ${isActive ? "underline underline-offset-8 decoration-2 text-emerald-100" : ""}`;
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 z-50 bg-emerald-800 text-white" >
      <Link href="/">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight hover:text-emerald-100 transition-colors">
          SABHE FURNITURE STORE
        </h1>
      </Link>
          
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
      </nav>
    </header>
  );
};

export default Header;
