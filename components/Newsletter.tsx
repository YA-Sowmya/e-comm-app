"use client";

import { useState } from "react";
import Button from "./Button";
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  return (
    <section className=" p-6 bg-cherry">
      <div className="border-t border-white py-2 px-12"></div>
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Heading */}
        <div className="flex gap-2 items-center justify-center pt-12 pb-6">
          <img src="/point.png" className="w-8 h-8" />
          <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
            JOIN THE CLUB
          </h2>
        </div>
        <p className="mb-6 font-body text-white font-light text-xl">
          Get exclusive discounts & early access to new treats!
        </p>
        <form className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 rounded-xl text-cherry bg-white w-full sm:w-72 focus:outline-cherry "
          />
          <Button type="submit" className="">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
