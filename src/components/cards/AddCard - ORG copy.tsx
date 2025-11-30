import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from './Card';

interface AddCardProps {
  type: 'folder' | 'bookmark';
  onClick: () => void;
  showSubText?: boolean;
}

export function AddCard({ type, onClick }: AddCardProps) {
  return (
    <Card
      className="group hover:shadow-md transition-all duration-200 cursor-pointer border-dashed border-2 hover:border-primary/50"
      onClick={onClick}
      title={type === 'folder' ? 'Create a new folder' : 'Save a new bookmark'}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[120px]">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
          <Plus className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium text-center">Add {type === 'folder' ? 'Folder' : 'Bookmark'}</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {type === 'folder' ? 'Create a new folder' : 'Save a new bookmark'}
        </p>
      </CardContent>
    </Card>
  );
}