import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  try {
    const { amount, details, items, userId } = await req.json();
    const safeItems = Array.isArray(items) ? items : [];

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        email: details?.email || "",
        name: details?.name || "",
        userId: userId || "",
        addressLine1: details?.addressLine1 || "",
        addressLine2: details?.addressLine2 || "",
        city: details?.city || "",
        state: details?.state || "",
        postalCode: details?.postalCode || "",
        country: details?.country || "",
        total: amount.toString(),
        cartItems: safeItems.map((i) => `${i.id}:${i.quantity}`).join(","),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
