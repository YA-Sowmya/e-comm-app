"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cherry text-white py-10">
      <div className="border-t border-white py-4 "></div>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-body">
        {/* Brand / Logo */}
        <div>
          <h2 className="text-2xl  font-heading">[Cherry Picked]</h2>
          <p className="mt-3 text-sm font-light">
            Bringing sweetness to your doorstep with the finest gummies,
            chocolates, and pops.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-accent">
            <li>
              <a href="#banner" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/shop/products" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/shop/search" className="hover:underline">
                Search
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-xl text-white border border-white bg-cherry w-full sm:w-72 focus:outline-cherry "
            />
            <button
              type="submit"
              className="bg-cherry px-4 py-2 font-semibold border border-white rounded-full
              hover:bg-accent hover:text-cherry transition">
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-yellow-300">
              <Facebook />
            </a>
            <a href="#" className="hover:text-yellow-300">
              <Instagram />
            </a>
            <a href="#" className="hover:text-yellow-300">
              <Twitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Sweet Treats. All rights reserved.
      </div>
    </footer>
  );
}
