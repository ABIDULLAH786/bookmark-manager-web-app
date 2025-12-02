'use client'
import { NotificationProvider } from "../Notification";
import { usePathname } from "next/navigation";
import { Header } from "../Header";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";


export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();


    // Define routes where you want to show the Header
    // const showHeaderRoutes = ["/", "/videos"];
    const excludeHeader = ["/login", "/register"];
    const showHeader = !excludeHeader.includes(pathname);

    // Same as above two lines
    // Show header on these routes:
    // const showHeader =
    //     pathname === "/" ||
    //     pathname.startsWith("/private-page")

    return (
        <AuthProvider>
            <ThemeProvider>
                <ModalProvider>
                    <NotificationProvider>
                        {showHeader && <Header />}
                             {children}
                    </NotificationProvider>
                </ModalProvider>
            </ThemeProvider>

        </AuthProvider>
    );
}
