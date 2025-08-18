"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Button from "./Button";

export default function AdminNavbar() {
  const { user, setUser, clearUser } = useUserStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Hydrate user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored && !user) {
      setUser(JSON.parse(stored));
    }
  }, [user, setUser]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    signOut();
  };

  return (
    <header className="relative p-2">
      {/*  Navbar */}
      <nav className="flex items-center justify-between px-4 py-2 bg-accent text-cherry font-heading text-lg lg:text-xl ">
        {/* Logo */}
        <Link href="/admin" className="relative inline-block px-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className=" w-12 h-12 rounded-full bg-white shadow-lg z-0"></div>
          </div>
          <img
            src="/logo.png"
            alt="Cherry Shop Logo"
            className="relative  w-16 lg:w-20  h-auto object-contain z-10"
          />
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-5xl mx-2 ">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-1 md:py-2 border rounded-full bg-white focus:outline-cherry"
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Add Button */}
          <Link href="/admin/products/new">
            <Button className="flex items-center text-lg justify-center ">
              <i className="bi bi-plus-lg leading-none m-0 p-0" />
              <span className="hidden ml-2 font-body md:inline-block">ADD</span>
            </Button>
          </Link>

          {/* Profile */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white border border-cherry flex items-center justify-center shadow">
                <i className="bi bi-person-fill text-cherry text-xl" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    Notifications
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
