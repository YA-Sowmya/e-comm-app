"use client";
import React from "react";
const steps = ["Cart", "Details", "Payment"];

export default function CheckoutStepper({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="w-full flex items-center justify-center gap-4 py-4">
      {steps.map((label, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border 
                ${
                  active
                    ? "bg-cherry text-white border-cherry"
                    : done
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-600 border-gray-300"
                }`}>
              {idx + 1}
            </div>
            <span
              className={`text-sm ${
                active ? "font-bold text-cherry" : "text-gray-700"
              }`}>
              {label}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-10 h-[2px] bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
