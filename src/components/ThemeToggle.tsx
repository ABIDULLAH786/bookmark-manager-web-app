"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"; // 1. Import from library
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 2. Avoid Hydration Mismatch
  // We only render the UI after the client has mounted and knows the correct theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering on server to avoid mismatch errors
  if (!mounted) {
    // Return a placeholder with the same size to prevent layout shift
    return <Button variant="ghost" className="rounded-full w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      // 3. Use setTheme to switch logic
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
      size="icon" // Ensures standard square size for icons
      aria-label="Toggle Theme"
    >
      {/* 4. Check explicitly for dark mode */}
      {theme === "dark" ? (
        <Moon className="w-5 h-5 transition-all" />
      ) : (
        <Sun className="w-5 h-5 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;