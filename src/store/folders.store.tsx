import { IFolderClient } from "@/types/folder";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FoldersState {
  folders: IFolderClient[];
  setFolders: (folders: IFolderClient[]) => void;
  addFolder: (folder: IFolderClient) => void;
  removeFolder: (id: string) => void;
  updateFolder: (folder: IFolderClient) => void;
}

export const useFoldersStore = create<FoldersState>()(
  persist(
    (set) => ({
      folders: [],
      addFolder: (folder: IFolderClient) => set((state) => ({ folders: [folder, ...state.folders] })),
      removeFolder: (id: string) => set((state) => ({ folders: state.folders.filter((folder) => folder._id !== id) })),
      updateFolder: (folder: IFolderClient) => set((state) => ({ folders: state.folders.map((f) => (f._id === folder._id ? folder : f)) })),
      setFolders: (folders: IFolderClient[]) => set({ folders }),
    }),
    { name: "folders-storage" } // key for localStorage
  )
);
