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
          <div key={label} className="flex items-center font-body gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border 
                ${
                  active
                    ? "bg-white border-cherry text-cherry"
                    : done
                    ? "bg-cherry text-white bordercherry"
                    : "bg-white text-cherry border-gray-300"
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
