"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) =>
        setCategories([{ id: "all", name: "All" }, ...data])
      );
  }, []);

  return (
    <>
      <section className="w-full bg-accent">
        <div className="text-center p-4 text-cherry font-heading">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-wide">
            BITE INTO BLISS
          </h1>
          <p className="mt-2 opacity-90 tracking-[0.25em]">
            CHERRY DELIGHTS AWAIT
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{ height: "30vw" }}>
          <div
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2 bg-cherry rounded-full"
            style={{
              width: "140vw",
              aspectRatio: "1 / 1",
            }}
          />

          <img
            src="/main.png"
            alt="Cake with cherries"
            className="relative z-10 max-h-[80%] w-auto"
          />
        </div>

        <div className="bg-cherry">
          <div className="max-w-6xl mx-auto p-4 text-white text-center">
            <Button className="rounded-full bg-white text-cherry font-heading shadow hover:font-bold hover:scale-105 transform transition">
              SHOP NOW
            </Button>
          </div>
        </div>
      </section>

      <section className="p-6  bg-cherry">
        <div className="border-t border-white py-2 md:py-6 px-12"></div>
        <div className="flex gap-2 items-center justify-center p-2 md:p-4">
          <img src="/point.png" className="w-8 h-8" />
          <h2 className="text-2xl md:text-3xl text-center text-white font-heading ">
            Shop By Category
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4  md:gap-12">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/products${
                cat.id === "all" ? "" : `?category=${cat.id}`
              }`}
              className="flex items-center justify-center rounded-full bg-white shadow-sm shadow-accent
              w-25 h-25 sm:w-30 sm:h-30 md:w-38 md:h-38 text-xs sm:text-sm md:text-lg  
              text-cherry font-heading hover:shadow-md transition">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
