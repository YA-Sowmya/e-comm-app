"use client";

import { useState } from "react";

const faqs = [
  { q: "Do you offer free shipping?", a: "Yes, on orders above $49." },
  {
    q: "Are your products vegetarian?",
    a: "Absolutely! All our gummies and chocolates are 100% vegetarian.",
  },
  {
    q: "How long does delivery take?",
    a: "Typically 3–7 business days.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="p-6 bg-cherry">
      <div className="border-t border-white py-2 px-12"></div>
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <div className="flex gap-2 items-center justify-center p-12">
          <img src="/point.png" className="w-8 h-8" />
          <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
            FAQs
          </h2>
        </div>
        <div className="space-y-4 text-white font-body ">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-white rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition"
              onClick={() => setOpen(open === idx ? null : idx)}>
              <h3 className="">{faq.q}</h3>
              {open === idx && (
                <p className="mt-2 text-accent font-light">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
