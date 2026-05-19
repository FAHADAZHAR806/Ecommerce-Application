"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
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

// 1. Core Login Form Sub-Component consuming dynamic Search Params
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back! Redirecting...");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-2xl p-2 shadow-2xl shadow-purple-950/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-plus-jakarta tracking-tight text-zinc-100">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          Enter your credentials to access your secure dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200 placeholder:text-zinc-600 transition-all"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-zinc-300 font-medium text-xs"
              >
                Password
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="pl-10 bg-white/[0.02] border-white/[0.08] focus:border-purple-500 rounded-xl text-zinc-200 placeholder:text-zinc-600 transition-all"
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-purple-500/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              "Sign In to Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// 2. Exported Default Page Wrapper with strict Next.js App Router Suspense integration
export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
      <Suspense
        fallback={
          <Card className="w-full max-w-md bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-center min-h-[350px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
            <p className="text-zinc-400 text-sm font-medium">
              Initializing secure portal nodes...
            </p>
          </Card>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
