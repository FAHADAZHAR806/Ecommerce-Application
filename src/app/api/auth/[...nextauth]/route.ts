import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db/connect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password parameters provided.");
        }

        await connectDB();

        // Search database for corresponding user profile record
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });
        if (!user) {
          throw new Error(
            "No user profile discovered with this email identity.",
          );
        }

        // Verify cryptographic hash validity
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Incorrect access credentials provided.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isApprovedSeller: user.isApprovedSeller,
        };
      },
    }),
  ],
  callbacks: {
    // Inject custom user role metrics into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApprovedSeller = user.isApprovedSeller;
      }
      return token;
    },
    // Make the role states globally available on the client-side session context hook
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "customer" | "seller" | "admin";
        session.user.isApprovedSeller = token.isApprovedSeller as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Token lifecycle duration window: 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
