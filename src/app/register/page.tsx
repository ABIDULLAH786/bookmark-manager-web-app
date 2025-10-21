"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useNotification } from "../components/Notification";
import Input from "../components/Input";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();


  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match")
      return;
    }

    try {
      // react-query
      // loading, error, debounce
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
      console.log("RESPONSE IS : ", res)
      const data = await res.json();
      
      if (!res.ok) {
        showNotification(data?.error || "Registration failed", "error");

        setErrors(data?.error || "Registration failed")
        return
        // throw new Error("Registration failed");
      }
      showNotification(data?.message || "User registered successfully", "success");

      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error("Registration Error: ", {error});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors(""); // Clear error on any input change
  };


  return (
    <div className=" grid place-items-center  gap-2 min-h-screen">
      <div className="bg-neutral-700 p-5 rounded-2xl drop-shadow-amber-50 flex flex-col gap-7 items-center justify-center max-h-min">
        <h1 className="text-3xl text-center font-bold">Register</h1>

        <form onSubmit={handleSumit} className="grid gap-2">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            required
          />
          {errors && (
            <span className="text-red-500 text-xs mt-1">{errors}</span>
          )}

          <button
            type="submit"
            className="bg-amber-400 text-white font-medium px-4 py-2 rounded-md shadow-sm hover:bg-amber-500 transition duration-200 ease-in-out"
          >
            Register
          </button>
        </form>
        <div>
          <p>
            Already have an account? <a href="/login" className="hover:underline text-blue-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
