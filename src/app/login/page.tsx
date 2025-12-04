"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';

import React, { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/components/Notification";
import Link from "next/link";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import { Button } from "@/components/ui/button";
import CenterContainer from "@/components/CenterContainer";
import { Label } from "@/components/ui/label";
function LoginPage() {
  <Suspense fallback={<div>Loading...</div>}>
    <LoginForm />
  </Suspense>
}


function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const baseUrl = window?.location?.origin; // "http://localhost:3000"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("callbackUrl: ", callbackUrl)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,

    });

    if (result?.error) {
      showNotification(result?.error || "Login failed", "error");
    } else {
      showNotification("Logged in successfully", "success");
      router.push(callbackUrl.replace(baseUrl, "") || "/");
    }
  };

  return (
    <CenterContainer>
      <h1 className="text-2xl font-semibold text-center mb-2">Welcome Back</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button variant="default" type="submit" className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <LoginWithGoogleButton />
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-foreground font-medium hover:underline"
        >
          Register
        </Link>
      </div>
    </CenterContainer >

  );
}
export default LoginPage;
