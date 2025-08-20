"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl h-screen">
      <div className="flex justify-between text-cherry items-center ">
        <h1 className="text-2xl font-bold font-heading mb-6">Products</h1>
      </div>

      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-cherry text-white rounded-lg">
            <th className="p-3 text-left rounded-l-lg">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left rounded-r-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr
              key={p.id}
              className="bg-accent text-cherry text-body rounded-lg shadow">
              <td className="p-3 rounded-l-lg">{p.name}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3 flex gap-2 rounded-r-lg">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="underline hover:text-gray-700">
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="underline hover:text-gray-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
