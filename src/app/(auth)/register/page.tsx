"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, Mail, Lock, User, Store } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // FIX: Extracted watch and setValue from useForm directly to handle roles cleanly
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      role: "customer",
      name: "",
      email: "",
      password: "",
      storeName: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register", data);

      if (response.status === 201) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
      <Card className="w-full max-w-md bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-2xl p-2 shadow-2xl shadow-purple-950/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
            Create Account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Join us as a consumer or open up your premium seller storefront
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Account Role Toggle Strip */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setValue("role", "customer")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === "customer"
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Customer Account
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "seller")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === "seller"
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Vendor Storefront
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-zinc-300 font-medium text-xs"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-zinc-300 font-medium text-xs"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Dynamic Store Input Displayed purely if Vendor Role is active */}
            {selectedRole === "seller" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label
                  htmlFor="storeName"
                  className="text-zinc-300 font-medium text-xs"
                >
                  Store / Brand Name
                </Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Acme Digital Boutique"
                    {...register("storeName")}
                    className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                    disabled={isLoading}
                  />
                </div>
                {errors.storeName && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {errors.storeName.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-zinc-300 font-medium text-xs"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
