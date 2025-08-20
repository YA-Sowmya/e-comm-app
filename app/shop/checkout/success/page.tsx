"use client";
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
export default function Success() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <div className="text-center text-cherry font-body mt-12">
      <h1>Payment Successful </h1>
      <p>Thank you for your purchase!</p>
    </div>
  );
}
