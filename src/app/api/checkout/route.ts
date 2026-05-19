import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";
import connectDB from "@/lib/db/connect";
import Product from "@/models/Product";

// Initialize Stripe instance using the server-side restricted API token key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, // Pinning a highly stable, structured API core release profile
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Guard: Transactions require an authenticated user profile to tie orders cleanly
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please authenticate to complete purchase." },
        { status: 401 },
      );
    }

    await connectDB();
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          message:
            "No transaction payload discovered inside active checkout streams.",
        },
        { status: 400 },
      );
    }

    const lineItems = [];

    // Loop through client item streams and resolve real pricing parameters directly against MongoDB records
    for (const item of items) {
      const actualProduct = await Product.findById(item.id);

      if (!actualProduct) {
        return NextResponse.json(
          {
            message: `Inventory tracking fault: Product reference ${item.id} not found.`,
          },
          { status: 404 },
        );
      }

      // Identify corresponding SKU variant inside resolved database array properties
      const activeVariant = actualProduct.variants.find(
        (v: any) => v.sku === item.sku,
      );
      const runtimePrice = activeVariant
        ? activeVariant.price
        : actualProduct.basePrice;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: actualProduct.title,
            images: [actualProduct.images[0]],
            description: `SKU: ${item.sku}`,
          },
          // Convert price metrics cleanly to cents to fulfill formal decimal processing structures
          unit_amount: Math.round(runtimePrice * 100),
        },
        quantity: item.quantity,
      });
    }

    // Provision Stripe Checkout Session container settings
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email!,
      metadata: {
        userId: session.user.id,
        // Stringify checkout item map parameters safely for post-payment webhooks to read later
        orderPayload: JSON.stringify(
          items.map((i: any) => ({ id: i.id, sku: i.sku, qty: i.quantity })),
        ),
      },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("STRIPE_SESSION_PROVISION_FAILURE:", error);
    return NextResponse.json(
      { message: error.message || "Financial transaction setup failed." },
      { status: 500 },
    );
  }
}
