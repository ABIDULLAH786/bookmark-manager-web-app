"use client";

import { useRouter } from 'nextjs-toploader/app';
import React, { useState } from "react";
import { useNotification } from "@/components/Notification";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import Container from "@/components/CenterContainer";
import { Label } from "@/components/ui/label";
function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data?.error || "Registration failed", "error");
        setErrors(data?.error || "Registration failed");
        return;
      }

      showNotification(data?.message || "User registered successfully", "success");
      router.push("/login");
    } catch (error) {
      console.error("Registration Error: ", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors("");
  };

  return (
    <Container>
      <h1 className="text-2xl font-semibold text-center mb-2 text-black dark:text-white">Create Account</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Get started with your new account
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          required
        />

        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        <Label htmlFor="confirm-password">Confirm Password *</Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        {errors && (
          <span className="text-destructive text-xs mt-1">{errors}</span>
        )}

        <Button type="submit" className="w-full mt-2">
          Register
        </Button>
      </form>
      <div className="mt-6">
        <LoginWithGoogleButton />
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium hover:underline"
        >
          Login
        </Link>
      </div>
    </Container>

  );
}

export default RegisterPage;