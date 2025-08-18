"use client";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className=" h-screen hidden lg:block  bg-accent text-cherry font-heading   px-6 py-6 lg:flex flex-col gap-6 text-lg">
      <Link
        href="/admin/"
        className="hover:bg-white rounded-full px-4 py-2 hover:scale-105 trasition transform ">
        Dashboard
      </Link>
      <Link
        href="/admin/products"
        className="hover:bg-white rounded-full px-4 py-2 hover:scale-105 trasition transform ">
        Products
      </Link>
      <Link
        href="/admin/orders"
        className="hover:bg-white rounded-full px-4 py-2 hover:scale-105 trasition transform ">
        Orders
      </Link>
      <Link
        href="/admin/categories"
        className="hover:bg-white rounded-full px-4 py-2 hover:scale-105 trasition transform ">
        Categories
      </Link>
      <Link
        href="/admin/analytics"
        className="hover:bg-white rounded-full px-4 py-2 hover:scale-105 trasition transform ">
        Analytics
      </Link>
    </aside>
  );
};

export default Sidebar;
