// /api/webhook/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// ---------- Prisma Singleton ----------
declare global {
  var prisma: PrismaClient | undefined;
}
const prisma = globalThis.prisma || new PrismaClient();
if (!globalThis.prisma) globalThis.prisma = prisma;

// ---------- Stripe Setup ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// ---------- Disable body parsing for Stripe signature ----------
export const config = {
  api: {
    bodyParser: false,
  },
};

// ---------- Webhook Handler ----------
export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) throw new Error("Missing stripe-signature header");

    const body = await req.text(); // raw body required
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ---------- Checkout Session Completed ----------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // retrieve line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata?.userId ?? null;

      await prisma.order.create({
        data: {
          email: session.customer_details?.email ?? "",
          name: session.customer_details?.name ?? "",
          addressLine1: session.customer_details?.address?.line1 ?? "",
          addressLine2: session.customer_details?.address?.line2 ?? "",
          city: session.customer_details?.address?.city ?? "",
          state: session.customer_details?.address?.state ?? "",
          postalCode: session.customer_details?.address?.postal_code ?? "",
          country: session.customer_details?.address?.country ?? "",
          total: session.amount_total ?? 0,
          stripePI: (session.payment_intent as string) ?? "",
          userId,
          items: {
            create: lineItems.data.map((item) => ({
              productId: (item.price?.product as string) ?? "unknown",
              name: item.description ?? "Unnamed product",
              price: item.amount_total ?? 0,
              quantity: item.quantity ?? 1,
              picture: "",
            })),
          },
        },
      });

      console.log("✅ Order saved for Checkout Session:", session.id);
    }

    // ---------- PaymentIntent Succeeded ----------
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = paymentIntent.metadata?.userId ?? null;
      const products = JSON.parse(paymentIntent.metadata?.products ?? "[]");

      await prisma.order.create({
        data: {
          email: paymentIntent.receipt_email ?? "",
          name: "Guest",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          total: paymentIntent.amount_received,
          stripePI: paymentIntent.id,
          userId,
          items: {
            create: products.map((item: any) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              picture: item.picture ?? "",
            })),
          },
        },
      });

      console.log("✅ Order saved for PaymentIntent:", paymentIntent.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
