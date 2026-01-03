"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';
import { ArrowLeft } from "lucide-react"; // 1. Import Icon

import React, { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/components/Notification";
import Link from "next/link";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import { Button } from "@/components/ui/button";
import CenterContainer from "@/components/CenterContainer";
import { Label } from "@/components/ui/label";

function LoginPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <LoginForm />
  </Suspense>
}

function LoginForm() {
  // ... existing state/hooks logic (omitted for brevity as per your snippet) ...

  return (
    <CenterContainer>
      
      {/* 2. Add Back Button (Absolute Positioned) */}
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 md:top-8 md:left-8" 
        asChild
      >
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      <h1 className="text-2xl font-semibold text-center mb-2">Welcome Back</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Sign in to your account
      </p>

      {/* ... Form would go here ... */}

      <div className="mt-6">
        <LoginWithGoogleButton />
      </div>

    </CenterContainer >
  );
}

export default LoginPage; 