"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
const offers = [
  {
    text: (
      <>
        Get <span className="text-cherry font-bold">20% OFF</span> your first
        order!
      </>
    ),
    button: "Shop Now",
  },
  {
    text: (
      <>
        Buy 2 <span className="text-cherry font-bold">Chocolates</span>, get 1
        free!
      </>
    ),
    button: "Grab Offer",
  },
  {
    text: (
      <>
        Flat <span className="text-cherry font-bold">15% OFF</span> on all
        Gummies!
      </>
    ),
    button: "Order Now",
  },
];

export default function SpecialOffers() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 4000); // rotates every 4s
    return () => clearInterval(interval);
  }, []);

  const currentOffer = offers[index];

  return (
    <section className="relative p-6 bg-cherry">
      {/* Divider */}
      <div className="border-t border-white py-2 px-12"></div>

      {/* Heading */}
      <div className="flex gap-2 items-center justify-center p-12">
        <img src="/point.png" className="w-8 h-8" />
        <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
          SPECIAL OFFERS
        </h2>
      </div>

      {/* Centered Offer Box */}
      <div className="flex justify-center">
        <div className="p-8 rounded-lg w-full max-w-4xl bg-white shadow-md border border-gray-100 flex flex-col items-center justify-center transition-all duration-500">
          <p className="text-lg font-medium mb-4 text-center">
            {currentOffer.text}
          </p>
          <Button>{currentOffer.button}</Button>
        </div>
      </div>
    </section>
  );
}
