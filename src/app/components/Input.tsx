// components/Input.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputProps {
  label?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";


  return (
    <div className="flex flex-col gap-1 relative">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          // className="h-10 w-full pr-10 px-3 rounded border text-sm text-zinc-900 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          className={`h-10 w-full pr-10 px-3 rounded border text-sm text-zinc-900 
          ${error ? "border-red-500 focus:ring-red-500" : "border-amber-300 focus:ring-amber-400"} 
          focus:outline-none focus:ring-2 bg-white`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff  className="h-5 w-5 stroke-amber-300"/> : <Eye className="h-5 w-5 stroke-amber-300"/>}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

export default Input;
