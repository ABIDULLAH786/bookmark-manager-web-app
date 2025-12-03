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
    <Card
      className="flex items-center group h-fit hover:shadow-md transition-all duration-200 cursor-pointer border-dashed border-2 hover:border-primary/50"
      onClick={onClick}
      title={type === 'folder' ? 'Create a new folder' : 'Save a new bookmark'}
    >
      <div className="flex items-center justify-center gap-2 w-full px-2 py-4">
  <Button
    variant="ghost"
    className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors"
  >
    <Plus className="h-4 w-4 text-primary" />
  </Button>

  <h3 className="font-medium">Add {type === "folder" ? "Folder" : "Bookmark"}</h3>
</div>

    </Card>
  );
}