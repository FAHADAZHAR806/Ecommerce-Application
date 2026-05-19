import DefaultUser from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "seller" | "admin";
      isApprovedSeller: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "customer" | "seller" | "admin";
    isApprovedSeller: boolean;
  }
}
