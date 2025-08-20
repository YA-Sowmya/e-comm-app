"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";

interface Category {
  id: string;
  name: string;
}

export default function EditProductForm() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    status: "INACTIVE",
    picture: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  //Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          stock: data.stock?.toString() || "",
          categoryId: data.categoryId || "",
          status: data.status?.toUpperCase() || "INACTIVE",
          picture: data.picture || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  //Fetch categories
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

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: status.toUpperCase(),
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      console.error("Error updating product");
    }
  };

  if (loading)
    return <p className="p-8 text-center text-cherry">Loading product...</p>;

  return (
    <div className="p-8 text-body bg-white w-full flex-col h-screen rounded-lg text-cherry">
      <h2 className="text-2xl font-bold font-heading mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-8 lg:pr-12">
        <div className="flex lg:flex-row flex-col gap-12">
          {/* Left Column */}
          <div className="w-full">
            {/* Name */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-cherry rounded-lg px-4 p-2"
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
                rows={4}
                required
                className="w-full border border-cherry rounded-lg px-4 p-2"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-cherry rounded-lg px-4 p-2"
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
                  required
                  className="w-full border border-cherry rounded-lg px-4 p-2"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full">
            {/* Category */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-cherry rounded-lg px-4 p-2">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm lg:text-base font-medium text-gray-700 p-2">
                Status
              </label>
              <div className="flex flex-col gap-4 px-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={formData.status === "ACTIVE"}
                    onChange={handleChange}
                  />
                  ACTIVE
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={formData.status === "INACTIVE"}
                    onChange={handleChange}
                  />
                  INACTIVE
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
                className="file:border file:border-cherry file:text-gray-500 file:text-xs file:mr-4 w-full border border-cherry rounded-lg px-4 p-2"
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

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            Cancel
          </button>
          <Button type="submit" {...(uploading ? { isDisabled: true } : {})}>
            {uploading ? "Saving..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
