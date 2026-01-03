import React from 'react';
import { AddCard } from './cards/AddCard';
import { FolderCard } from './cards/FolderCard';
import { BookmarkCard } from './cards/BookmarkCard';
import { IBookmarkClient, IFolderClient } from '@/types';
import { Card } from './cards/Card';
import { Separator } from './ui/separator';
import { FolderGridSkeleton } from './loaders/FolderGridSkeleton';
import { BookmarkGridSkeleton } from './loaders/BookmarkGridSkeleton';

interface HomepageProps {
  folders: IFolderClient[];
  bookmarks: IBookmarkClient[];
  isFoldersLoading: boolean;
  isBookmarksLoading: boolean;
  onAddFolder: () => void;
  onAddBookmark: () => void;
}

export function Homepage({
  folders,
  bookmarks,
  isFoldersLoading,
  isBookmarksLoading,
  onAddFolder,
  onAddBookmark
}: HomepageProps) {

  return (
    <div className="px-4 py-8">
      <Card className=" flex flex-col md:flex-row justify-between border-none">
        <div className=''>
          <h2 className="text-2xl font-semibold mb-2">Your Bookmarks</h2>
          <p className="text-muted-foreground">
            Organize and access your favorite links and resources
          </p>
        </div>
        <div className='flex gap-2'>

          <AddCard type="folder" onClick={onAddFolder} />
          <AddCard type="bookmark" onClick={onAddBookmark} />
        </div>
      </Card>
      <Separator className="mt-4 mb-4" />
      
      <h3 className='text-2xl font-semibold mb-3'>Folders</h3>

      {/* Folders Section */}
      <div className="mb-8">
        {/* If loading, show skeleton. Else if we have folders, show them. */}
        {isFoldersLoading ? (
          <FolderGridSkeleton />
        ) : (
          folders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                />
              ))}
            </div>
          )
        )}

        {/* Empty State for Folders (Optional, only show if not loading and no folders) */}
        {!isFoldersLoading && folders.length === 0 && (
          <p className="text-sm text-slate-500 italic">No folders yet.</p>
        )}
      </div>
      <Separator className="mt-4 mb-4" />
      {/* Bookmarks Section */}
      <h3 className='text-2xl font-semibold mb-3'>Bookmarks</h3>
      <div>
        {isBookmarksLoading ? (
          <BookmarkGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            ))}
          </div>
        )}

        {!isBookmarksLoading && bookmarks.length === 0 && (
          <p className="text-sm text-slate-500 italic">No bookmarks yet.</p>
        )}
      </div>
    </div>
  );
}