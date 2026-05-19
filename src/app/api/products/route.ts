import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db/connect";
import Product from "@/models/Product";

/**
 * GET /api/products
 * Public catalog discovery endpoint with support for search, categorization, and pagination
 */
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Parse filter matrices from query streams
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    if (category) {
      query.category = category.toLowerCase();
    }

    if (search) {
      // Execute fast MongoDB indexing text search weights
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate("sellerId", "name vendorDetails.storeName")
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("CATALOG_FETCH_EXCEPTION:", error);
    return NextResponse.json(
      { message: "Failed to retrieve product catalog." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/products
 * Protected inventory submission entry node for approved vendors
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Guard: Enforce strict role validation checks before allocating server resources
    if (
      !session ||
      (session.user.role !== "seller" && session.user.role !== "admin")
    ) {
      return NextResponse.json(
        { message: "Unauthorized. Merchant status required." },
        { status: 403 },
      );
    }

    if (session.user.role === "seller" && !session.user.isApprovedSeller) {
      return NextResponse.json(
        { message: "Forbidden. Your vendor account is awaiting approval." },
        { status: 403 },
      );
    }

    await connectDB();
    const body = await req.json();

    // Helper: Generate a unique URL handle from the submission title string
    const generatedSlug =
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 7);

    const productPayload = {
      ...body,
      sellerId: session.user.id,
      slug: generatedSlug,
    };

    const freshProduct = await Product.create(productPayload);

    return NextResponse.json(
      { message: "Product listed successfully.", product: freshProduct },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("PRODUCT_CREATION_EXCEPTION:", error);
    return NextResponse.json(
      { message: error.message || "Failed to catalog product entry." },
      { status: 500 },
    );
  }
}
