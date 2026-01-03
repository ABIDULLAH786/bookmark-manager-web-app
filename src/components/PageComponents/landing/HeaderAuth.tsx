"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, LogIn } from "lucide-react";

export default function HeaderAuth({ session }: { session: any }) {
    if (session) {
        return (
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4 md:mr-1" />
                        Dashboard
                    </Link>
                </Button>
                <Button variant="default" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="w-4 h-4 md:mr-2" />
                    Logout
                </Button>
               
            </div>
        );
    }

    return (
        <Button variant="default" size="sm" asChild>
            <Link href="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
            </Link>
        </Button>
    );
}