"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
// If you use next-auth, you can import useSession from "next-auth/react"

export default function DetailsPage() {
  const router = useRouter();
  const { details, setDetails } = useCheckoutStore();
  const items = useCartStore((s) => s.items);

  const canContinue =
    details.name &&
    details.email &&
    details.addressLine1 &&
    details.city &&
    details.postalCode &&
    details.country &&
    items.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <CheckoutStepper current={1} />
      <h1 className="text-2xl font-bold mb-4">Contact & Shipping</h1>

      {/* If not logged in, show guest note */}
      <div className="mb-4 rounded-lg border p-3 bg-yellow-50 text-yellow-800">
        You’re checking out as a guest.{" "}
        <a className="underline" href="/login">
          Log in
        </a>{" "}
        to save your details.
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/shop/checkout/payment");
        }}
        className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded p-2"
            placeholder="Full name"
            value={details.name}
            onChange={(e) => setDetails({ name: e.target.value })}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Email"
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ email: e.target.value })}
            required
          />
        </div>

        <input
          className="border rounded p-2 w-full"
          placeholder="Address line 1"
          value={details.addressLine1}
          onChange={(e) => setDetails({ addressLine1: e.target.value })}
          required
        />
        <input
          className="border rounded p-2 w-full"
          placeholder="Address line 2 (optional)"
          value={details.addressLine2 ?? ""}
          onChange={(e) => setDetails({ addressLine2: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border rounded p-2"
            placeholder="City"
            value={details.city}
            onChange={(e) => setDetails({ city: e.target.value })}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="State/Region"
            value={details.state}
            onChange={(e) => setDetails({ state: e.target.value })}
          />
          <input
            className="border rounded p-2"
            placeholder="Postal code"
            value={details.postalCode}
            onChange={(e) => setDetails({ postalCode: e.target.value })}
            required
          />
        </div>
        <input
          className="border rounded p-2"
          placeholder="Country (e.g., US)"
          value={details.country}
          onChange={(e) => setDetails({ country: e.target.value })}
          required
        />

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={!canContinue}
            className="bg-cherry text-white px-4 py-2 rounded-full disabled:opacity-50">
            Next: Payment
          </button>
        </div>
      </form>
    </div>
  );
}
