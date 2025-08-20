import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, details, cart, userId } = body;

    // Fallbacks to prevent undefined errors
    const safeCart = Array.isArray(cart) ? cart : [];

    const cartItemsString = JSON.stringify(
      safeCart.map((item: any) => ({
        id: item.id || "",
        name: item.name || "Unnamed product",
        price: item.price || 0,
        quantity: item.quantity || 1,
        picture: item.picture || "",
      }))
    );

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
        cartItems: cartItemsString,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
