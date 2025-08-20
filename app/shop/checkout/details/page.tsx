"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect } from "react";

export default function DetailsPage() {
  const router = useRouter();
  const { details, setDetails } = useCheckoutStore();
  const items = useCartStore((s) => s.items);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      if (!details.name) setDetails({ name: user.name });
      if (!details.email) setDetails({ email: user.email });
    }
  }, [user, details.name, details.email, setDetails]);

  const canContinue =
    details.name &&
    details.email &&
    details.addressLine1 &&
    details.city &&
    details.postalCode &&
    details.country &&
    items.length > 0;

  return (
    <div className="max-w-3xl text-cherry mx-auto px-4 py-6">
      <CheckoutStepper current={1} />
      <h1 className="text-xl sm:text-2xl font-bold font-heading text-center m-4">
        Contact & Shipping
      </h1>
      {!user && (
        <div className="mb-4 rounded-lg font-body p-2">
          You’re checking out as a guest.{" "}
          <a className="underline" href="/auth/login">
            Log in
          </a>{" "}
          to save your details.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/shop/checkout/payment");
        }}
        className="space-y-3 font-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border bg-white focus:outline-cherry rounded p-2"
            placeholder="Full name"
            value={details.name}
            onChange={(e) => setDetails({ name: e.target.value })}
            required
          />
          <input
            className="border bg-white focus:outline-cherry rounded p-2"
            placeholder="Email"
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ email: e.target.value })}
            required
          />
        </div>

        <input
          className="border bg-white focus:outline-cherry rounded p-2 w-full"
          placeholder="Address line 1"
          value={details.addressLine1}
          onChange={(e) => setDetails({ addressLine1: e.target.value })}
          required
        />
        <input
          className="border bg-white focus:outline-cherry rounded p-2 w-full"
          placeholder="Address line 2 (optional)"
          value={details.addressLine2 ?? ""}
          onChange={(e) => setDetails({ addressLine2: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border bg-white focus:outline-cherry rounded p-2"
            placeholder="City"
            value={details.city}
            onChange={(e) => setDetails({ city: e.target.value })}
            required
          />
          <input
            className="border bg-white focus:outline-cherry rounded p-2"
            placeholder="State/Region"
            value={details.state}
            onChange={(e) => setDetails({ state: e.target.value })}
          />
          <input
            className="border bg-white focus:outline-cherry rounded p-2"
            placeholder="Postal code"
            value={details.postalCode}
            onChange={(e) => setDetails({ postalCode: e.target.value })}
            required
          />
        </div>
        <input
          className="border bg-white focus:outline-cherry rounded p-2"
          placeholder="Country"
          value={details.country}
          onChange={(e) => setDetails({ country: e.target.value })}
          required
        />

        <div className="pt-2 text-right">
          <Button
            type="submit"
            disabled={!canContinue}
            className="disabled:opacity-50">
            Next: Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
