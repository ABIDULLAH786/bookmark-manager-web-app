import React from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

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
            {pathname !== '/' && <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>}

            <Link href={"/"} className="flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">
                {currentFolder ? currentFolder : 'Bookmark Manager'}
              </h1>
            </Link>
          </div>
        </div>
        <div className='flex items-center justify-center gap-4 md:pr-5'>
          <ThemeToggle />
          {session||true ? <UserDropDown /> : null}
        </div>
      </div>
    </header>
  );
}



import { LogOut, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { signOut } from 'next-auth/react';

export default function UserDropDown() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-offset focus:ring-primary rounded-full">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
