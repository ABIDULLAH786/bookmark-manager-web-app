'use client'
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";
import { usePathname } from "next/navigation";
import Header from "./Header";

const urlEndPoint = process.env.NEXT_PUBLIC_IK_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define routes where you want to show the Header
    const showHeaderRoutes = ["/", "/videos"];
    // Show header on these routes:
    const showHeader =
        pathname === "/" ||
        pathname.startsWith("/private-page")
    // const showHeader = showHeaderRoutes.includes(pathname);
    return (
        <SessionProvider refetchInterval={5 * 60}>
            <NotificationProvider>
                {showHeader && <Header />}

                {children}
            </NotificationProvider>
        </SessionProvider>
    );
}
