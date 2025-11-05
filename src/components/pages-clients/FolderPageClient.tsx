"use client";

import React, { useState } from 'react';
import { FolderTree } from '@/components/FolderTree';
import { FolderCard } from '@/components/cards/FolderCard';
import { AddCard } from '@/components/cards/AddCard';
import { BookmarkCard } from '@/components/cards/BookmarkCard';
import { mockData } from '@/data/mockData';
import { Bookmark, Folder } from '@/types';
import { useModal } from '@/components/providers/ModalProvider';

interface FolderPageClientProps {
    id: string;
}

export default function FolderPageClient({ id }: FolderPageClientProps) {
    const currentFolderId = id;
    const [folders, setFolders] = useState<Folder[]>(mockData.folders);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockData.bookmarks);

    const { openAddFolder, openAddBookmark } = useModal();


    const currentFolder = folders?.find(f => f.id === currentFolderId);
    const subfolders = folders?.filter(f => f.parentId === currentFolderId);
    const folderBookmarks = bookmarks?.filter(b => b.folderId === currentFolderId);
    const rootBookmarks = currentFolderId ? [] : bookmarks?.filter(b => !b.folderId);
    const allDisplayBookmarks = currentFolderId ? folderBookmarks : rootBookmarks;

    const getFolderItemCount = (folderId: string) => {
        const subfolderCount = mockData?.folders.filter(f => f.parentId === folderId).length;
        const bookmarkCount = mockData?.bookmarks.filter(b => b.folderId === folderId).length;
        return subfolderCount + bookmarkCount;
    };

    const handleAddFolder = (folder: Folder) => {
        const newFolder: Folder = {
            id: folder.id,
            name: folder.name,
            description: folder.description,
            parentId: currentFolderId || undefined,
            createdAt: new Date()
        };
        setFolders([...folders, newFolder]);
    };

    const handleAddBookmark = (bookmark: Bookmark) => {
        const newBookmark: Bookmark = {
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            folderId: currentFolderId || undefined,
            favicon: '🔗',
            createdAt: new Date()
        };
        setBookmarks([...bookmarks, newBookmark]);
    };
    return (
        <div className="flex h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <div className="w-64 border-r bg-card p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Folders</h3>
                <FolderTree
                    folders={mockData?.folders}
                    currentFolderId={currentFolderId}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    <div className='md:flex justify-between'>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-2">
                                {currentFolder ? currentFolder.name : 'All Bookmarks'}
                            </h2>
                            {currentFolder?.description && (
                                <p className="text-muted-foreground">{currentFolder.description}</p>
                            )}

                        </div>
                        <div className='md:flex gap-3'>
                            {/* TODOS: add the small btn on the heading of the page  */}
                            {/* <AddCard type="folder" onClick={() => setShowAddFolderModal(true)} />
                            <AddCard type="bookmark" onClick={() => setShowAddBookmarkModal(true)} /> */}

                        </div>
                    </div>

                    {/* Subfolders */}
                    {subfolders?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-4">Folders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {subfolders?.map(folder => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        // TODO: add the folder item count in the folder folder model so that no need to do the same and on new folder in that case update the parent folder coundif any
                                        itemCount={getFolderItemCount(folder.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bookmarks */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4">
                            {currentFolder ? 'Bookmarks in this folder' : 'Recent Bookmarks'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AddCard type="folder" onClick={() => openAddFolder(handleAddFolder)} />
                            <AddCard type="bookmark" onClick={() => openAddBookmark(handleAddBookmark)} />

                            {allDisplayBookmarks?.map(bookmark => (
                                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
