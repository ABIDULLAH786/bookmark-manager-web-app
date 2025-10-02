"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "../components/Input";
import { useNotification } from "../components/Notification";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result?.error || "Login failed", "error");

    } else {
      showNotification("Loged in Successfully", "success");
      router.push("/");
    }
  };

  return (
    <div className=" grid place-items-center  gap-2 min-h-screen">
      <div className="bg-neutral-700 p-5 rounded-2xl drop-shadow-amber-50 flex flex-col gap-7 items-center justify-center max-h-min">
        <h1 className="text-3xl text-center font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="grid gap-2">
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            className="bg-amber-400 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:bg-amber-500 transition duration-200 ease-in-out"
          >
            Login
          </button>

        </form>
        <div>
          <p>
            Don't have an account ? <a href="/register" className="hover:underline text-blue-500">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
