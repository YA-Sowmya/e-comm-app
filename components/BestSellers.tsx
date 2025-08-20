"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "picture" | "price">;
}

export default function Bestsellers() {
  const [products, setProducts] = useState<ProductCardProps["product"][]>([]);

  useEffect(() => {
    fetch("/api/bestsellers")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  if (!products.length) return null;

  return (
    <section className=" mx-auto p-6 bg-cherry">
      <div className="border-t border-white py-2 px-12"></div>
      <div className="flex gap-2 items-center justify-center p-6">
        <img src="/point.png" className="w-8 h-8" />
        <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
          BEST SELLERS
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
