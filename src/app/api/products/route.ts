import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/validations/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope");

    let query = { approved: true };

    // Admin has access overrides to audit non-indexed items
    if (scope === "admin") {
      const session = await getServerSession(authOptions);
      if (session && (session.user as any).role === "admin") {
        query = {} as any;
      }
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (
      !session ||
      ((session.user as any).role !== "vendor" &&
        (session.user as any).role !== "admin")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access path locked." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { title, description, price, image, category, stock } = body;

    const autoApprove = (session.user as any).role === "admin";

    const newProduct = await Product.create({
      title,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock || 5),
      sellerId: session.user.email,
      sellerName: session.user.name,
      approved: autoApprove, // Admin listings bypass review queue pipelines
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Global update method for Admin node approval actions
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Root privileges required." },
        { status: 403 },
      );
    }

    const { id, approved } = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { approved },
      { new: true },
    );

    return NextResponse.json(
      { success: true, data: updatedProduct },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
