"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant={"ghost"}
      onClick={toggleTheme}
      
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  );
};

export default ThemeToggle;
