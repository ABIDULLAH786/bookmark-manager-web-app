import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from '../ui/button';

interface AddCardProps {
  type: 'folder' | 'bookmark';
  onClick: () => void;
  showSubText?: boolean;
}

export function AddCard({ type, onClick }: AddCardProps) {
  return (
    <div
    className='w-full'
      onClick={onClick}
      title={type === 'folder' ? 'Create a new folder' : 'Save a new bookmark'}
    >
       <Button
          type="button"
          variant={"ghost"}
          onClick={onClick}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:bg-surface/50 dark:hover:bg-surface/50 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <Plus size={16} />
          Add {type === 'folder' ? 'Folder' : 'Bookmark'}
        </Button>

    </div>
  );
}