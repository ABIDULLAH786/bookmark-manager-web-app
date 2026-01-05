"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ThemeSwitcherTabs() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Tabs
      value={theme}
      onValueChange={(value) => setTheme(value)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="system"  className="flex gap-1">
          <Monitor className="h-4 w-4" />
          System
        </TabsTrigger>
        <TabsTrigger value="light" className="flex gap-1">
          <Sun className="h-4 w-4" />
          Light
        </TabsTrigger>
        <TabsTrigger value="dark" className="flex gap-1">
          <Moon className="h-4 w-4" />
          Dark
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
