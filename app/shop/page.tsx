"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Bestsellers from "@/components/BestSellers";
import AboutSection from "@/components/About";
import CustomerReviews from "@/components/CustomerReviews";
import SpecialOffers from "@/components/SpecialOffers";
import NewsletterSignup from "@/components/Newsletter";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories([{ id: "all", name: "All" }, ...data]);
        } else {
          console.error("Unexpected API response:", data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <>
      <section id="banner" className="w-full bg-accent">
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
            <a
              href="/shop/products"
              className="rounded-full bg-white py-2 px-4 text-sm md:text-xl text-cherry font-heading shadow  font-bold
               hover:bg-cherry hover:shadow-white hover:text-white transform transition">
              SHOP NOW
            </a>
          </div>
        </div>
      </section>
      <Bestsellers />
      <section className="p-6  bg-cherry">
        <div className="border-t border-white py-2 md:py-6 px-12"></div>
        <div className="flex gap-2 items-center justify-center p-2 md:p-4">
          <img src="/point.png" className="w-8 h-8" />
          <h2 className="text-2xl md:text-3xl text-center text-white font-heading ">
            Shop By Category
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-16 mt-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/products${
                cat.id === "all" ? "" : `?category=${cat.id}`
              }`}
              className="flex items-center justify-center rounded-full bg-white shadow-accent
              w-20 h-20 md:w-30 sm:h-30  text-xs sm:text-sm md:text-2xl  
              text-cherry font-heading hover:scale-110  transition">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
      <AboutSection />
      <CustomerReviews />
      <SpecialOffers />
      <NewsletterSignup />
      <FAQ />
      <Footer />
    </>
  );
}
