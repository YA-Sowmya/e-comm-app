import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Stripe requires raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
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

    // All metadata you attached in create-payment-intent
    const {
      email,
      name,
      userId,
      addressLine1,
      city,
      state,
      postalCode,
      country,
      total,
      cartItems,
    } = intent.metadata as any;

    try {
      // Save the order + items
      await prisma.order.create({
        data: {
          email,
          name,
          userId,
          total: Number(total),
          stripePI: intent.id,
          addressLine1,
          city,
          state,
          postalCode,
          country,
          items: {
            create: JSON.parse(cartItems).map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
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
