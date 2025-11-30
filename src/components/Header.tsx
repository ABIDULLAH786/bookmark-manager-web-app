import React from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


interface HeaderProps {
  currentFolder?: string;
}

export function Header({ currentFolder }: HeaderProps) {
  const pathname = usePathname();
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
        <ThemeToggle />
      </div>
    </header>
  );
}