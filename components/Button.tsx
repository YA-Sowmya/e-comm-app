"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string; // optional extra styles
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 bg-cherry md:px-6 text-sm md:text-xl text-accent rounded-full border hover:bg-white hover:text-cherry hover:border-cherry transition ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }${className}`}>
      {children}
    </button>
  );
}
