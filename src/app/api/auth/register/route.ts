import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required core property matrix keys.",
        },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Identity token collision. Email address occupied.",
        },
        { status: 409 },
      );
    }

    const secureHashedPassword = await bcrypt.hash(password, 11);

    const newUser = await User.create({
      name,
      email,
      password: secureHashedPassword,
      role: role || "customer",
    });

    return NextResponse.json(
      { success: true, userId: newUser._id },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
