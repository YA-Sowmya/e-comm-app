import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Expecting body from frontend: { amount, details: {...}, cart: [...] }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, details, cart, userId } = body; // amount in cents

    // Convert cart to JSON string for metadata
    const cartItemsString = JSON.stringify(
      cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        picture: item.picture || "",
      }))
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        email: details.email || "",
        name: details.name || "",
        userId: userId || "",
        addressLine1: details.addressLine1 || "",
        addressLine2: details.addressLine2 || "",
        city: details.city || "",
        state: details.state || "",
        postalCode: details.postalCode || "",
        country: details.country || "",
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
