"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
export default function CategoriesPage() {
  const [name, setName] = useState("");
  interface Category {
    id: string;
    name: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await axios.get("/api/categories");
    setCategories(data);
  };

  const addCategory = async () => {
    if (!name.trim()) return;
    await axios.post("/api/categories", { name });
    setName("");
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    try {
      // First attempt to delete
      await axios.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id)); // Instant UI update
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message =
          error.response?.data?.error || "This category has products linked.";
        const confirmDelete = confirm(
          `${message}\n\nDo you still want to delete it along with its products?`
        );

        if (confirmDelete) {
          // Force delete by deleting products first, then category
          await axios.delete(`/api/categories/${id}?force=true`);
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
        }
      } else {
        console.error("Delete failed:", error);
        alert("Failed to delete category");
      }
    }
  };

  return (
    <div className="p-6 bg-white text-cherry rounded-xl h-screen">
      <h1 className="text-2xl font-bold font-heading mb-6">
        Manage Categories
      </h1>

      {/* Add Category */}
      <div className="flex md:w-1/2 gap-2 mb-8">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <Button
          onClick={addCategory}
          className="bg-cherry text-white px-4 py-2 ">
          Add New Category
        </Button>
      </div>

      {/* Category List */}
      <ul className=" grid md:grid-cols-2 grid-cols-2 justify-center gap-4">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="text-cherry text-body shadow bg-accent p-4 rounded-lg flex justify-between items-center">
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-cherrry hover:text-red-500"
              title="Delete">
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
