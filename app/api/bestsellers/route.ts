import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Group order items by productId and count total quantities
    const bestsellers = await prisma.orderItem.groupBy({
      by: ["productId", "name", "price", "picture"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10, // top 10
    });

    return NextResponse.json(bestsellers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch bestsellers" },
      { status: 500 }
    );
  }
}
