import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/validations/auth";

// PUT: Update a product (Secured)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "vendor" && session.user.role !== "admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();

    // Ensure vendors can only edit their own products
    const query =
      session.user.role === "admin"
        ? { _id: params.id }
        : { _id: params.id, vendorId: session.user.id };
    const updatedProduct = await Product.findOneAndUpdate(query, body, {
      new: true,
    });

    if (!updatedProduct)
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a product completely (Secured)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "vendor" && session.user.role !== "admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const query =
      session.user.role === "admin"
        ? { _id: params.id }
        : { _id: params.id, vendorId: session.user.id };
    const deleted = await Product.findOneAndDelete(query);

    if (!deleted)
      return NextResponse.json(
        { error: "Product deletion unauthorized" },
        { status: 404 },
      );
    return NextResponse.json({
      success: true,
      message: "Asset successfully purged.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
