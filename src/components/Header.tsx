import React, { useRef } from 'react';
import { ArrowLeft, Bookmark, Download, Loader2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { SidebarTrigger } from './ui/sidebar';
import { useSession } from "next-auth/react";


interface HeaderProps {
  currentFolder?: string;
}

export function Header({ currentFolder }: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className='flex items-center'>
          <SidebarTrigger />

          <div className="flex items-center gap-4">
            {pathname !== '/dashboard' && <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>}

            <Link href={"/dashboard"} className="flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">
                {currentFolder ? currentFolder : BRAND_NAME}
              </h1>
            </Link>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 md:pr-5'>
          <ThemeToggle />
          {session || true ? <UserDropDown /> : null}
        </div>
      </div>
    </header>
  );
}



import { LogOut, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signOut } from 'next-auth/react';
import { BRAND_NAME } from '@/constants';
import { useBookmarkActions } from '@/hooks/useBookmarkActions';

export default function UserDropDown() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleExport, handleImport, loading } = useBookmarkActions();

  // Helper to trigger the hidden input
  const triggerFileInput = (e: Event) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };
  return (
    <>
      {/* Hidden Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".html"
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-offset focus:ring-primary rounded-full">
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-surface'>
          <DropdownMenuLabel className='text-muted-foreground'>
            <span> User:</span>
            <span> {session?.user?.name ?? session?.user?.email?.split("@")[0]}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer' onClick={handleExport}>
            <Download className="h-4 w-4" /> Export Bookmarks
          </DropdownMenuItem>

          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={triggerFileInput} // Use onSelect for Dropdown items to prevent closing early if needed
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{loading ? "Importing..." : "Import Bookmarks"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  );
}


