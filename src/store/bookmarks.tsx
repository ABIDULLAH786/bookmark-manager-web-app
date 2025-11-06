import { IBookmarkClient } from "@/types/bookmark";
import { create } from "zustand";


interface BookmarkState {
    bookmarks: IBookmarkClient[];
    addBookmark: (bookmark: IBookmarkClient) => void;
    removeBookmark: (id: string) => void;
    updateBookmark: (bookmark: IBookmarkClient) => void;

}

export const useBookmarkStore = create<BookmarkState>()(
    (set) => ({
        bookmarks: [
            {
                _id: '1',
                title: 'React Documentation',
                url: 'https://react.dev',
                description: 'Official React documentation',
                icon: '⚛️',
                folderId: '4',
                createdAt: new Date('2024-01-20')
            },
            {
                _id: '2',
                title: 'Tailwind CSS',
                url: 'https://tailwindcss.com',
                description: 'Utility-first CSS framework',
                favicon: '🎨',
                folderId: '4',
                createdAt: new Date('2024-01-21')
            },
            {
                _id: '3',
                title: 'Node.js',
                url: 'https://nodejs.org',
                description: 'JavaScript runtime environment',
                favicon: '🟢',
                folderId: '5',
                createdAt: new Date('2024-01-22')
            },
            {
                _id: '4',
                title: 'GitHub',
                url: 'https://github.com',
                description: 'Code hosting platform',
                favicon: '🐙',
                createdAt: new Date('2024-01-23')
            },
            {
                _id: '5',
                title: 'Figma',
                url: 'https://figma.com',
                description: 'Design and prototyping tool',
                favicon: '🎯',
                folderId: '2',
                createdAt: new Date('2024-01-24')
            },
            {
                _id: '6',
                title: 'TechCrunch',
                url: 'https://techcrunch.com',
                description: 'Technology news and analysis',
                favicon: '📰',
                folderId: '3',
                createdAt: new Date('2024-01-25')
            }
        ],
        addBookmark: (bookmark: IBookmarkClient) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
        removeBookmark: (id: string) => set((state) => ({ bookmarks: state.bookmarks.filter((bookmark) => bookmark?._id != id) })),
        updateBookmark: (bookmark: IBookmarkClient) => set((state) => ({ bookmarks: state.bookmarks.map(b => b._id == bookmark._id ? bookmark : b) }))
    })
)