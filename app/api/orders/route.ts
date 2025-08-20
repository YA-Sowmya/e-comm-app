import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { details, items, total, stripePI, userId } = await req.json();

    if (!details || !items?.length || !total || !stripePI) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        email: details.email || "",
        name: details.name || "guest user",
        addressLine1: details.addressLine1 || "",
        addressLine2: details.addressLine2 || null,
        city: details.city || "",
        state: details.state || "",
        postalCode: details.postalCode || "",
        country: details.country || "",
        total: Number(total),
        stripePI,
        userId: userId ?? null,
        items: {
          create: items.map((i: any) => ({
            productId: i.id || "",
            name: i.name || "guest user",
            price: Math.round(Number(i.price) * 100),
            quantity: i.quantity || 1,
            picture: i.picture || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
