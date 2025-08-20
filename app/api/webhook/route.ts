import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    // Metadata comes as strings
    const {
      email,
      name,
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      total,
      cartItems,
    } = intent.metadata as any;

    try {
      // Ensure cartItems is valid JSON array
      const itemsArray = cartItems ? JSON.parse(cartItems) : [];

      await prisma.order.create({
        data: {
          email,
          name,
          userId: userId || null,
          total: Number(total || 0),
          stripePI: intent.id,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state,
          postalCode,
          country,
          items: {
            create: itemsArray.map((item: any) => ({
              productId: item.id || "",
              name: item.name || "Unnamed product",
              quantity: Number(item.quantity || 1),
              price: Number(item.price || 0),
              picture: item.picture || null,
            })),
          },
        },
      });

      console.log("✅ Order stored in DB:", intent.id);
    } catch (dbErr: any) {
      console.error("❌ Database error:", dbErr.message);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
