import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// Stripe requires raw body, disable Next.js parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text(); // raw body

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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ retrieve purchased items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // ✅ custom metadata (userId, cart info)
      const userId = session.metadata?.userId ?? null;

      // ✅ save order to database
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
              picture: "", // optional: could pass in metadata
            })),
          },
        },
      });

      console.log("✅ Order saved for session:", session.id);
    }
  } catch (err: any) {
    console.error("❌ Error saving order:", err.message);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
