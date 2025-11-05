"use client";

import React, { createContext, useContext, useState } from "react";
import { AddBookmarkModal } from "../modals/AddBookmarkModal";
import { AddFolderModal } from "../modals/AddFolderModal";
import { Bookmark, Folder } from "@/types";

interface ModalContextType {
  openAddBookmark: (onSubmit?: (data: Bookmark) => void) => void;
  openAddFolder: (onSubmit?: (data: Folder) => void) => void;
  closeModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Store dynamic callback
  const [onBookmarkSubmit, setOnBookmarkSubmit] = useState<((data: Bookmark) => void) | undefined>(undefined);
  const [onFolderSubmit, setOnFolderSubmit] = useState<((data: Folder) => void) | undefined>(undefined);

  const openAddBookmark = (onSubmit?: (data: Bookmark) => void) => {
    setOnBookmarkSubmit(() => onSubmit || undefined);
    setShowBookmarkModal(true);
  };

  const openAddFolder = (onSubmit?: (data: Folder) => void) => {
    setOnFolderSubmit(() => onSubmit || undefined);
    setShowFolderModal(true);
  };

  const closeModals = () => {
    setShowBookmarkModal(false);
    setShowFolderModal(false);
  };

  return (
    <ModalContext.Provider value={{ openAddBookmark, openAddFolder, closeModals }}>
      {children}

      {/* Global Modals */}
      <AddBookmarkModal
        open={showBookmarkModal}
        onClose={closeModals}
        onSubmit={onBookmarkSubmit}
      />
      <AddFolderModal
        open={showFolderModal}
        onClose={closeModals}
        onSubmit={onFolderSubmit}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
};
