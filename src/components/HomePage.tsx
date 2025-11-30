import React from 'react';
import { AddCard } from './cards/AddCard';
import { FolderCard } from './cards/FolderCard';
import { BookmarkCard } from './cards/BookmarkCard';
import { IBookmarkClient, IFolderClient } from '@/types';
import { Card } from './cards/Card';
import { Separator } from './ui/separator';

interface HomepageProps {
  folders: IFolderClient[];
  bookmarks: IBookmarkClient[];
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
      <Card className=" flex flex-row justify-between border-none">
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
          <Separator className="mt-4 mb-8" />


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">


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