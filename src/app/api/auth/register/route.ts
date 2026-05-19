import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/connect";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // 1. Rigorous backend-level validation check against the shared schema
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid payload details.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password, role, storeName } = validationResult.data;

    // 2. Prevent identity collision: Check if email identity is already registered
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return NextResponse.json(
        { message: "An account with this email address already exists." },
        { status: 409 },
      );
    }

    // 3. Cryptographically hash the user's password securely
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Assemble the dynamic schema object state based on the selected user role
    const userData: any = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isApprovedSeller: false, // Explicitly false initially; requires Admin clearance
    };

    if (role === "seller") {
      userData.vendorDetails = {
        storeName,
        storeDescription: "",
        taxId: "",
        businessAddress: "",
        supportEmail: email.toLowerCase(),
      };
    }

    // 5. Commit record securely to MongoDB
    const newUser = await User.create(userData);

    return NextResponse.json(
      { message: "User registered successfully.", userId: newUser._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("CRITICAL_REGISTRATION_EXCEPTION:", error);
    return NextResponse.json(
      {
        message:
          "An unexpected server-side exception occurred while writing account.",
      },
      { status: 500 },
    );
  }
}
