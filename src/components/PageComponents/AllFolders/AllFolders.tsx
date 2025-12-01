'use client';
import React, { useEffect, useState } from 'react';
import { Homepage } from '@/components/HomePage';
import { AddFolderModal } from '@/components/modals/AddFolderModal';
import { AddBookmarkModal } from '@/components/modals/AddBookmarkModal';
import { fetcher } from '@/helper/fetcher';
import useSWR from "swr";
import { useFolderStore } from '@/store/folders.store';
import { useBookmarkStore } from '@/store/bookmarks';
import { API_PATHS } from '@/lib/apiPaths';

export default function AllFolders() {
  const { folders: storeFolders, setFolders } = useFolderStore()
  const {bookmarks, setBookmarks} = useBookmarkStore()
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false);
  const { data: foldersData, error: foldersError, isLoading: foldersLoading } = useSWR([API_PATHS.FOLDERS.LIST().url, {}], fetcher);
  const { data: bookmarksData, error: bookmarksError, isLoading: bookmarksLoading } = useSWR([API_PATHS.BOOKMARKS.LIST().url, {}], fetcher);
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
          folders={storeFolders}
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