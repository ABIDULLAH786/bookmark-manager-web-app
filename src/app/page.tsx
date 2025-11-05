'use client';
import React, { useState } from 'react';
import { Bookmark, Folder } from '@/types';
import { mockData } from '@/data/mockData';
import { Homepage } from '@/components/HomePage';
import { AddFolderModal } from '@/components/modals/AddFolderModal';
import { AddBookmarkModal } from '@/components/modals/AddBookmarkModal';

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(mockData.folders);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockData.bookmarks);
  const [currentFolderId ] = useState<string | undefined>(); //TODO: do somthing of this currentFolderID
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);


  const handleAddFolder = (folder: Folder) => {
    const newFolder: Folder = {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      parentId: currentFolderId || undefined,
      createdAt: new Date()
    };
    setFolders([...folders, newFolder]);
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    const newBookmark: Bookmark = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      folderId: currentFolderId || undefined,
      favicon: '🔗',
      createdAt: new Date()
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  return (
    <div className="min-h-screen bg-background">


      <main>
        <Homepage
          folders={folders}
          bookmarks={bookmarks}
          onAddFolder={() => setShowAddFolderModal(true)}
          onAddBookmark={() => setShowAddBookmarkModal(true)}
        />
      </main>

      <AddFolderModal
        open={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        onSubmit={handleAddFolder}
      />

      <AddBookmarkModal
        open={showAddBookmarkModal}
        onClose={() => setShowAddBookmarkModal(false)}
        onSubmit={handleAddBookmark}
      />
    </div>
  );
}