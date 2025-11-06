import { IFolderClient } from "@/types/folder";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FoldersState {
  folders: IFolderClient[];
  addFolder: (folder: IFolderClient) => void;
  removeFolder: (id: string) => void;
  updateFolder: (folder: IFolderClient) => void;
}

export const useFoldersStore = create<FoldersState>()(
  persist(
    (set) => ({
      folders: [
        {
          _id: '1',
          name: 'Development',
          description: 'Programming resources and tools',
          createdAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          name: 'Design',
          description: 'UI/UX and design inspiration',
          createdAt: new Date('2024-01-16')
        },
        {
          id: '3',
          name: 'News',
          description: 'Tech news and articles',
          createdAt: new Date('2024-01-17')
        },
        {
          id: '4',
          name: 'Frontend',
          description: 'Frontend development resources',
          parentId: '1',
          createdAt: new Date('2024-01-18')
        },
        {
          id: '5',
          name: 'Backend',
          description: 'Backend development resources',
          parentId: '1',
          createdAt: new Date('2024-01-19')
        }
      ],
      addFolder: (folder: IFolderClient) => set((state) => ({ folders: [...state.folders, folder] })),
      removeFolder: (id: string) => set((state) => ({ folders: state.folders.filter((folder) => folder._id !== id) })),
      updateFolder: (folder: IFolderClient) => set((state) => ({ folders: state.folders.map((f) => (f._id === folder._id ? folder : f)) })),
    }),
    { name: "folders-storage" } // key for localStorage
  )
);
