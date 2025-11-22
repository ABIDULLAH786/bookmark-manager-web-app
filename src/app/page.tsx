'use client';
import React, { useState } from 'react';
import { Bookmark, Folder } from '@/types';
import { mockData } from '@/data/mockData';
import { Homepage } from '@/components/HomePage';
import { AddFolderModal } from '@/components/modals/AddFolderModal';
import { AddBookmarkModal } from '@/components/modals/AddBookmarkModal';
import { fetcher } from '@/helper/fetcher';
import useSWR from "swr";

export default function App() {
  const [currentFolderId] = useState<string | undefined>(); //TODO: do somthing of this currentFolderID
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const { data: folders, error: foldersError, isLoading: foldersLoading } = useSWR(["/api/folders", {}], fetcher);
  const { data: bookmarks, error: bookmarksError, isLoading: bookmarksLoading } = useSWR(["/api/bookmarks", {}], fetcher);
  console.log({folders})
  console.log({bookmarks})

  const handleAddFolder = (folder: Folder) => {
    const newFolder: Folder = {
      _id: folder._id,
      name: folder.name,
      description: folder.description,
      parentId: currentFolderId || undefined,
      createdAt: new Date()
    };
    // setFolders([...folders, newFolder]);
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    const newBookmark: Bookmark = {
      _id: bookmark._id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      folderId: currentFolderId || undefined,
      icon: '🔗',
      createdAt: new Date()
    };
    // setBookmarks([...bookmarks, newBookmark]);
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