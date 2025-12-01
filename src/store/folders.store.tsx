import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IFolderClient, ISubFolderClient } from "@/types/folder";
import { IBookmarkClient } from "@/types";

interface FoldersState {
  folders: IFolderClient[];
  setFolders: (folders: IFolderClient[]) => void;
  addFolder: (folder: IFolderClient) => void;
  removeFolder: (id: string) => void;
  updateFolder: (folder: IFolderClient) => void;

  // -------------(Single Selected Folder Along with Subfolders and Bookmarks)---------------
  singleSelectedFolder: ISubFolderClient | undefined;
  setSingleSelectedFolder: (data: ISubFolderClient) => void;
  removeSingleSelectedFolder: () => void;
  addSubFolderToSelected: (subFolder: IFolderClient) => void;
  removeSubFolderFromSelected: (subFolderId: string) => void;
  updateSubFolderInSelected: (subFolder: IFolderClient) => void;

  // ------------(Single Slected Folder state handlers for Bookmarks)---------------
  addBookmarkToSelected: (bookmark: IBookmarkClient) => void;
  removeBookmarkFromSelected: (bookmarkId: string) => void;
  updateBookmarkInSelected: (bookmark: IBookmarkClient) => void;
}

export const useFoldersStore = create<FoldersState>()(
  persist(
    (set) => ({
      // ... Existing Sidebar Logic ...
      folders: [],
      setFolders: (folders) => set({ folders }),
      addFolder: (folder) => set((state) => ({ folders: [folder, ...state.folders] })),
      removeFolder: (id) => set((state) => ({
        folders: state.folders.filter((f) => f._id !== id)
      })),
      updateFolder: (folder) => set((state) => ({
        folders: state.folders.map((f) => (f._id === folder._id ? folder : f))
      })),

      // -------------(Single Selected Folder Along with Subfolders and Bookmarks)---------------
      singleSelectedFolder: undefined,
      setSingleSelectedFolder: (data) => set({ singleSelectedFolder: data }),
      removeSingleSelectedFolder: () => set({ singleSelectedFolder: undefined }),
      addSubFolderToSelected: (subFolder) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Add ( || [] ) to handle undefined
            subFolders: [
              subFolder,
              ...(state.singleSelectedFolder.subFolders || [])
            ]
          }
        };
      }),

      removeSubFolderFromSelected: (subFolderId) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Ensure we are filtering an array, not undefined
            subFolders: (state.singleSelectedFolder.subFolders || []).filter(
              (f) => f._id !== subFolderId
            )
          }
        };
      }),

      updateSubFolderInSelected: (updatedSubFolder) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Ensure we are mapping an array
            subFolders: (state.singleSelectedFolder.subFolders || []).map((f) =>
              f._id === updatedSubFolder._id ? updatedSubFolder : f
            )
          }
        };
      }),


      // -------------(Single Selected Folder state handlers for Bookmark)
      addBookmarkToSelected: (bookmark) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Ensure we are mapping an array
            bookmarks: [...(state.singleSelectedFolder.bookmarks || []), bookmark]
          }
        };
      }),

      removeBookmarkFromSelected: (bookmarkId) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Ensure we are mapping an array
            bookmarks: (state.singleSelectedFolder.bookmarks || []).filter(
              (b) => b._id !== bookmarkId
            )
          }
        };
      }),

      updateBookmarkInSelected: (updatedBookmark) => set((state) => {
        if (!state.singleSelectedFolder) return {};

        return {
          singleSelectedFolder: {
            ...state.singleSelectedFolder,
            // FIX HERE: Ensure we are mapping an array
            bookmarks: (state.singleSelectedFolder.bookmarks || []).map((b) =>
              b._id === updatedBookmark._id ? updatedBookmark : b
            )
          }
        };
      }),
    }),
    {
      name: "folders-storage",
    }
  )
);