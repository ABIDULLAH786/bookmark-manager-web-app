"use client";

import React, { createContext, useContext, useState } from "react";
import { AddBookmarkModal } from "../modals/AddBookmarkModal";
import { AddFolderModal } from "../modals/AddFolderModal";

interface ModalContextType {
  openAddBookmark: (parentFolderId?: string) => void;
  openAddFolder: (parentFolderId?: string) => void;
  closeModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [parentFolderId, setParentFolderId] = useState<string>("");

  const openAddBookmark = (folderId?: string) => {
    setParentFolderId(folderId || "");
    setShowBookmarkModal(true);
  };

  const openAddFolder = (folderId?: string) => {
    setParentFolderId(folderId || "");
    setShowFolderModal(true);
  };

  const closeModals = () => {
    setShowBookmarkModal(false);
    setShowFolderModal(false);
  };

  return (
    <ModalContext.Provider value={{ openAddBookmark, openAddFolder, closeModals }}>
      {children}

      {/* Global modals with internal API logic */}
      <AddBookmarkModal
        open={showBookmarkModal}
        onClose={closeModals}
        parentFolderId={parentFolderId}
      />

      <AddFolderModal
        open={showFolderModal}
        onClose={closeModals}
        parentFolderId={parentFolderId}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
};
