import { Bookmark, Folder } from '@/types';
import React from 'react';
import { AddCard } from './cards/AddCard';
import { FolderCard } from './cards/FolderCard';
import { BookmarkCard } from './cards/BookmarkCard';

interface HomepageProps {
  folders: Folder[];
  bookmarks: Bookmark[];
  onAddFolder: () => void;
  onAddBookmark: () => void;
}

export function Homepage({
  folders,
  bookmarks,
  onAddFolder,
  onAddBookmark
}: HomepageProps) {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Bookmarks</h2>
        <p className="text-muted-foreground">
          Organize and access your favorite links and resources
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AddCard type="folder" onClick={onAddFolder} />
        <AddCard type="bookmark" onClick={onAddBookmark} />

        {folders?.map((folder) => (
          <FolderCard
            key={folder._id}
            folder={folder}
          />
        ))}

        {bookmarks?.map((bookmark) => (
          <BookmarkCard key={bookmark._id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}