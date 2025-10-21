"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const { data: session } = useSession();
    const { showNotification } = useNotification();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = async () => {
        try {
            await signOut();
            showNotification("Signed out successfully", "success");
        } catch {
            showNotification("Failed to sign out", "error");
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-base-300 sticky top-0 z-40 bg-gray-900">
            <div className="container mx-auto flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-xl font-bold btn btn-ghost normal-case text-amber-50  "
                    prefetch={true}
                    onClick={() =>
                        showNotification("Welcome to ImageKit ReelsPro", "info")
                    }
                >
                    <Home className="w-5 h-5 group-hover:stroke-amber-500 transition-colors duration-200" />

                    <span className="hover:text-amber-500 transition-colors duration-200">
                        Next Auth
                    </span>

                </Link>

                {/* User Icon and Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="group cursor-pointer"
                    >
                        <User className="w-5 h-5 text-amber-50 group-hover:stroke-amber-500 transition-colors duration-200" />
                    </button>

                    {dropdownOpen && (
                        <ul className="bg-gray-800 text-amber-50 absolute right-0 mt-2 w-40 rounded bg-base-100 py-2 shadow-lg z-50">
                            {session ? (
                                <>
                                    <li className="px-4 py-1">
                                        <span className="text-sm opacity-70">
                                            User: {session.user?.email?.split("@")[0]}
                                        </span>
                                    </li>
                                    <div className="divider my-1" />

                                    <li>
                                        <Link
                                            href="/private-page"
                                            className="block w-full px-4 py-2 hover:bg-amber-500"
                                            onClick={() =>
                                                showNotification("Welcome to Private Page that only only access able wile user is logged In", "info")
                                            }
                                        >
                                            Private Page
                                        </Link>
                                    </li>

                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-4 py-2 cursor-pointer text-left text-error hover:bg-amber-500"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <ul>
                                    <li>
                                        <Link
                                            href="/login"
                                            className="block w-full px-4 py-2 hover:bg-amber-500"
                                            onClick={() =>
                                                showNotification("Please sign in to continue", "info")
                                            }
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/private-page"
                                            className="block w-full px-4 py-2 hover:bg-amber-500"
                                            onClick={() =>
                                                showNotification("Welcome to Private Page that only only access able wile user is logged In", "info")
                                            }
                                        >
                                            Private Page
                                        </Link>
                                    </li>
                                </ul>

                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
