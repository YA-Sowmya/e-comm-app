"use client";
import React from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/useUserStore";

export default function Navbar() {
  const totalCount = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  const { user, clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
  };

  return (
    <nav className="w-full bg-accent shadow-md p-4 flex items-center justify-center gap-2 text-lg lg:text-2xl">
      {/* Left Links (Desktop) */}
      <div className="hidden shadow md:flex items-center bg-white rounded-full mx-4 px-6 lg:px-12 py-2 font-heading text-cherry justify-between w-full">
        <Link href="/shop" className="hover:scale-110 transform transition">
          Home
        </Link>
        <Link
          href="/shop/products"
          className="hover:scale-110 transform transition">
          Shop
        </Link>
        <Link
          href="/shop#about"
          className="hover:scale-110 transform transition">
          About
        </Link>
      </div>

      {/* Left Icons (Mobile) */}
      <div className="flex md:hidden items-center bg-white rounded-full shadow px-4 sm:px-6 py-2 text-cherry justify-between w-full text-base sm:text-lg">
        <Link href="/shop">
          <i className="bi bi-house-door"></i>
        </Link>
        <Link href="/shop/products">
          <i className="bi bi-bag"></i>
        </Link>
        <Link href="/shop#about">
          <i className="bi bi-info-circle"></i>
        </Link>
      </div>

      {/* Logo */}
      <div className="flex justify-center w-2/3 sm:w-1/3 lg:w-1/5">
        <Link href="/" className="relative inline-block px-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white shadow-lg z-0"></div>
          </div>
          <img
            src="/logo.png"
            alt="Cherry Shop Logo"
            className="relative w-18 lg:w-24 h-auto object-contain z-10"
          />
        </Link>
      </div>

      {/* Right Links (Desktop) */}
      <div className="hidden shadow md:flex items-center bg-white rounded-full mx-4 px-6 lg:px-12 py-2 font-heading text-cherry justify-between w-full">
        <Link
          href="/shop/search"
          className="hover:scale-110 transform transition">
          Search
        </Link>
        <Link
          href="/shop/checkout/cart"
          className="hover:scale-110 transform transition">
          Cart {totalCount > 0 && <span>({totalCount})</span>}
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="hover:scale-110 transform transition">
            Logout
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="hover:scale-110 transform transition">
            Login
          </Link>
        )}
      </div>

      {/* Right Icons (Mobile) */}
      <div className="flex md:hidden items-center bg-white rounded-full shadow px-4 sm:px-6 py-2 text-cherry justify-between w-full text-base sm:text-lg">
        <Link href="/shop/search">
          <i className="bi bi-search"></i>
        </Link>
        <Link href="/shop/checkout/cart" className="relative flex items-center">
          <i className="bi bi-cart"></i>
          {totalCount > 0 && (
            <span className="bg-cherry text-white text-xs text-body rounded-full px-1">
              {totalCount}
            </span>
          )}
        </Link>
        {user ? (
          <button onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        ) : (
          <Link href="/auth/login">
            <i className="bi bi-person"></i>
          </Link>
        )}
      </div>
    </nav>
  );
}
