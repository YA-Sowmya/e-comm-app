import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE category by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    const categoryId = params.id;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({ where: { categoryId } });

    if (productCount > 0 && !force) {
      return NextResponse.json(
        { error: `This category has ${productCount} product(s) linked.` },
        { status: 400 }
      );
    }

    if (force) {
      await prisma.product.deleteMany({ where: { categoryId } });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
