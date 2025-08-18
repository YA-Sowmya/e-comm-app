"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateProductForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    status: "INACTIVE",
    picture: "",
  });

  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  // ✅ Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const signRes = await axios.post("/api/sign-cloudinary", {
        paramsToSign: { folder: "products" },
      });

      const { signature, timestamp, cloudName, apiKey } = signRes.data;

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", apiKey);
      uploadForm.append("timestamp", timestamp);
      uploadForm.append("signature", signature);
      uploadForm.append("folder", "products");

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        uploadForm
      );

      setFormData((prev) => ({
        ...prev,
        picture: cloudRes.data.secure_url,
      }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let status = formData.status;
    if (Number(formData.stock) === 0) {
      status = "INACTIVE";
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status,
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      console.error("Error creating product");
    }
  };

  return (
    <div className="p-8 text-body bg-white w-full flex-col h-screen rounded-lg text-cherry">
      <h2 className="text-2xl font-bold font-heading mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-8 lg:pr-12">
        <div className="flex lg:flex-row flex-col gap-12">
          <div className="w-full">
            {/* Product Name */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full border border-cherry rounded-lg mb-2 px-4 p-2 focus:ring focus:ring-cherry focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                required
                className="w-full border border-cherry rounded-lg mb-2 px-4 p-2 focus:ring focus:ring-cherry focus:outline-none"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full border border-cherry rounded-lg mb-2 px-4 p-2 focus:ring focus:ring-cherry focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="w-full border border-cherry rounded-lg mb-2 px-4 p-2 focus:ring focus:ring-cherry focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="w-full">
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-cherry rounded-lg mb-2 px-4 p-2">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Status */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Status
              </label>
              <div className="flex flex-col mb-2 gap-4 px-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={formData.status === "ACTIVE"}
                    onChange={handleChange}
                    className="text-cherry focus:ring-cherry"
                  />
                  <span>ACTIVE</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={formData.status === "INACTIVE"}
                    onChange={handleChange}
                    className="text-cherry focus:ring-cherry"
                  />
                  <span>INACTIVE</span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Product Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="file:border-cherry required file:border file:text-gray-700 file:text-sm file:p-1 w-full border border-cherry rounded-lg mb-2 px-4 p-2 focus:ring focus:ring-cherry focus:outline-none"
              />
              {uploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
              )}
              {formData.picture && (
                <img
                  src={formData.picture}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 bg-gray-200 text-sm md:text-base border border-gray-200 rounded-full hover:border-cherry hover:bg-gray-300 transition">
            Cancel
          </button>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
