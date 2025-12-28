import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cookies } from "next/headers";
import NextTopLoader from 'nextjs-toploader';

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
       <head>
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com/" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&amp;display=swap" rel="stylesheet" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
            <Toaster />
            <Providers>{children}</Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}