'use client';
import React, { useEffect, useState } from 'react';
import { Homepage } from '@/components/HomePage';
import { AddFolderModal } from '@/components/modals/AddFolderModal';
import { AddBookmarkModal } from '@/components/modals/AddBookmarkModal';
import { fetcher } from '@/helper/fetcher';
import useSWR from "swr";
import { useFoldersStore } from '@/store/folders.store';
import { useBookmarkStore } from '@/store/bookmarks';

export default function App() {
  const { folders, setFolders } = useFoldersStore()
  const {bookmarks, setBookmarks} = useBookmarkStore()
  const [currentFolderId] = useState<string | undefined>(); //TODO: do somthing of this currentFolderID
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const { data: foldersData, error: foldersError, isLoading: foldersLoading } = useSWR(["/api/folders", {}], fetcher);
  const { data: bookmarksData, error: bookmarksError, isLoading: bookmarksLoading } = useSWR(["/api/bookmarks", {}], fetcher);
  console.log({ foldersData })
  console.log({ bookmarksData })

  useEffect(() => {
    if (foldersData) {
      setFolders(foldersData)
    }
    if (bookmarksData) {
      setBookmarks(bookmarksData)
    }
  }, [foldersData, bookmarksData])

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
      />

      <AddBookmarkModal
        open={showAddBookmarkModal}
        onClose={() => setShowAddBookmarkModal(false)}
      />
    </div>
  );
}