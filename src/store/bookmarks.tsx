import { IBookmarkClient } from "@/types/bookmark";
import { create } from "zustand";


interface BookmarkState {
    bookmarks: IBookmarkClient[];
    setBookmarks: (bookmarks: IBookmarkClient[]) => void
    addBookmark: (bookmark: IBookmarkClient) => void;
    removeBookmark: (id: string) => void;
    updateBookmark: (bookmark: IBookmarkClient) => void;

}

export const useBookmarkStore = create<BookmarkState>()(
    (set) => ({
        bookmarks:[],
        setBookmarks: (bookmarks: IBookmarkClient[]) => set({ bookmarks }),
        addBookmark: (bookmark: IBookmarkClient) => set((state) => ({ bookmarks: [bookmark,...state.bookmarks] })),
        removeBookmark: (id: string) => set((state) => ({ bookmarks: state.bookmarks.filter((bookmark) => bookmark?._id != id) })),
        updateBookmark: (bookmark: IBookmarkClient) => set((state) => ({ bookmarks: state.bookmarks.map(b => b._id == bookmark._id ? bookmark : b) }))
    })
)