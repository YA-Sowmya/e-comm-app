"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Range } from "react-range";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  picture: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
}

const MIN = 0;
const MAX = 50;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN, MAX]);
  const [tempRange, setTempRange] = useState<[number, number]>([MIN, MAX]);
  const [isOpen, setIsOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "all";

  const fetchProducts = () => {
    const query = new URLSearchParams();
    if (category) query.append("category", category);
    if (priceRange[0]) query.append("minPrice", String(priceRange[0]));
    if (priceRange[1]) query.append("maxPrice", String(priceRange[1]));

    fetch(`/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, priceRange]);

  const CategoryList = (
    <div>
      <h3 className="font-bold font-heading text-cherry mb-2">
        Filter by Category
      </h3>
      <div className="flex font-body  flex-wrap gap-2">
        <button
          onClick={() => router.push(`/shop/products?category=all`)}
          className={`bg-white shadow text-cherry rounded-full px-3 py-1 ${
            category === "all" ? "font-bold" : ""
          }`}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/shop/products?category=${cat.id}`)}
            className={`bg-white shadow hover:shadow-cherry text-cherry rounded-full px-3 py-1 ${
              category === cat.id ? "font-bold" : ""
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      <h3 className="font-bold font-heading text-cherry mt-4 mb-2">Price</h3>
      <div className="px-2">
        <Range
          step={1}
          min={MIN}
          max={MAX}
          values={tempRange}
          onChange={(values) => setTempRange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-1 bg-gray-200 rounded relative w-full">
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  background: "#990000",
                  left: `${((tempRange[0] - MIN) / (MAX - MIN)) * 100}%`,
                  width: `${
                    ((tempRange[1] - tempRange[0]) / (MAX - MIN)) * 100
                  }%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-3 w-3 bg-cherry rounded-full shadow cursor-pointer"
            />
          )}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>${tempRange[0]}</span>
          <span>${tempRange[1]}</span>
        </div>
      </div>

      <button
        onClick={() => {
          setPriceRange(tempRange);
          setIsOpen(false);
        }}
        className="mt-4 bg-cherry font-body border hover:bg-white hover:text-cherry text-white px-4 py-2 rounded-full">
        Apply
      </button>
    </div>
  );

  return (
    <div className="flex flex-col px-2 md:px-6 w-full">
      {/* Heading row */}
      <div className="flex justify-between items-center px-4 py-3 ">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-cherry capitalize">
          {category === "all" ? "All Products" : category}
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden flex items-center gap-2 bg-white text-cherry px-4 py-2 rounded-full shadow">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex">
        {/* Desktop Aside */}
        <aside className="hidden md:block w-64 p-4 bg-white rounded-lg">
          {CategoryList}
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </main>
      </div>

      {/* Mobile  */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div className="w-78 bg-accent  h-full px-4 shadow-lg animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className=" font-heading">FILTERS</h3>
              <button onClick={() => setIsOpen(false)} className="text-cherry">
                <X size={20} />
              </button>
            </div>
            {CategoryList}
          </div>
        </div>
      )}
    </div>
  );
}
