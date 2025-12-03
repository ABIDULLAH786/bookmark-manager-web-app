import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cookies } from "next/headers";

const geistSans = {
  variable: "--font-geist-sans",
  className: "font-sans"
};
const geistMono = {
  variable: "--font-geist-mono",
  className: "font-mono"
};

export const metadata: Metadata = {
  title: "Bookmarks Manager",
  description: "The platform to manage your bookmarks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />

          {/* FIX APPLIED BELOW:
              1. Removed the nested <main> tag (SidebarInset is already a main).
              2. Added 'min-w-0' (CRITICAL) to force flexbox shrinking.
              3. Added 'overflow-hidden' to handle scrollbars correctly. 
          */}
          <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Toaster />
            <Providers>{children}</Providers>
          </SidebarInset>

        </SidebarProvider>
      </body>
    </html>
  );
}