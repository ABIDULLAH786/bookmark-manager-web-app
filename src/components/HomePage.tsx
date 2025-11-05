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
  const rootFolders = folders.filter(f => !f.parentId);
  const rootBookmarks = bookmarks.filter(b => !b.folderId);

  const getFolderItemCount = (folderId: string) => {
    const subfolders = folders.filter(f => f.parentId === folderId).length;
    const folderBookmarks = bookmarks.filter(b => b.folderId === folderId).length;
    return subfolders + folderBookmarks;
  };

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
        
        {rootFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            itemCount={getFolderItemCount(folder.id)}
          />
        ))}
        
        {rootBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}