"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentInner({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const { details } = useCheckoutStore();

  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      router.push("/shop/checkout/success");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg space-y-6 p-6">
      <PaymentElement />
      <Button
        onClick={handlePay}
        disabled={!stripe || loading}
        className="w-full disabled:opacity-50">
        {loading ? "Processing…" : "Pay now"}
      </Button>
    </div>
  );
}

export default function PaymentPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) =>
    s.items.reduce(
      (sum, i) => sum + Math.round(Number(i.price) * 100) * i.quantity,
      0
    )
  );
  const { details } = useCheckoutStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 || total <= 0) return;

    (async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "null");

        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            items,
            details,
            userId: user?.id || null,
          }),
        });

        const data = await res.json();
        console.log("Stripe API response:", data);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    })();
  }, [total, items.length, details]);

  if (!clientSecret)
    return (
      <div className="p-6 text-cherry font-body text-center mt-12">
        Preparing payment…
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto text-cherry px-4 py-6">
      <CheckoutStepper current={2} />
      <h1 className="text-xl sm:text-2xl font-bold font-heading text-center m-4">
        Payment
      </h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentInner clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}
