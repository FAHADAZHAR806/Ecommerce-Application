import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // or 'bcrypt' / your preferred hashing tool
import { connectDB } from "@/lib/db/connect"; // Adjust this to your DB helper
import { User } from "@/models/User"; // Adjust this to your user schema/model

export const authOptions: NextAuthOptions = {
  // Use JSON Web Tokens for session management
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  // Secret key used to sign tokens. Always keep this in your .env file!
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // 1. Connect to your database safely on the server side
        await connectDB();

        // 2. Find the user
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 3. Verify the hashed password
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }

        // 4. Return user object (this gets passed into the JWT callback below)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, // Optional: useful if doing Role-Based Access Control
        };
      },
    }),
  ],

  callbacks: {
    // Persist data from the authorize block into the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Pass the token data into the active session so the client-side can read it
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Redirect user here when authentication is required
    error: "/login", // Redirect on auth errors
  },
};
