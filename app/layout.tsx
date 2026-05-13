import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Components/header";
import AuthSync from "./Components/AuthSync";
import WhatsAppButton from "./Components/WhatsAppButton";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabhe Furniture Store",
  description: "Modern, artisanal furniture for your home. Sustainable quality from Addis Ababa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WishlistProvider>
          <CartProvider>
            <AuthSync />
            <Header />
            {children}
            <WhatsAppButton />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
