'use client'

import { NotificationProvider } from "../Notification";
import { usePathname } from "next/navigation";
import { Header } from "../Header";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider"; // This is your new file from Step 2
import { ModalProvider } from "./ModalProvider";
import { AppSidebar } from "../AppSidebar";
import { SidebarInset } from "../ui/sidebar";

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const excludeHeader = ["/login", "/register", "/"];
    const showHeader = !excludeHeader.includes(pathname);

    return (
        <AuthProvider>
            <ThemeProvider 
                attribute="class" 
                defaultTheme="system" 
                enableSystem
                disableTransitionOnChange
            >
                <ModalProvider>
                    <NotificationProvider>
                        {showHeader && <AppSidebar />}
                        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
                            {showHeader && <Header />}
                            {children}
                        </SidebarInset>
                    </NotificationProvider>
                </ModalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}