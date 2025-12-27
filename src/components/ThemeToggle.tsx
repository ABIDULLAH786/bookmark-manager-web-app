"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant={"ghost"}
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </Button>
  );
};

export default ThemeToggle;
