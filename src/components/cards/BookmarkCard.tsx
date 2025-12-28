import React from 'react';
import { ExternalLink, MoreVertical } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from '../ui/button';
import { IBookmarkClient } from '@/types';
import { BookmarkDropDown } from './BookmarkDropDown';

interface BookmarkCardProps {
  bookmark: IBookmarkClient;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const handleClick = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <Card className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0"> 
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
              {bookmark?.icon || '🔗'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{bookmark.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{bookmark.url}</p>
            </div>
          </div>
          <div
            className="opacity-100 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <BookmarkDropDown bookmark={bookmark} />
          </div>
        </div>
        {bookmark.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{bookmark.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span>Open link</span>
        </div>
      </CardContent>
    </Card>
  );
}