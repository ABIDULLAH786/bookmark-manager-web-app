"use client";

import { FolderTree } from '@/components/FolderTree';
import { FolderCard } from '@/components/cards/FolderCard';
import { AddCard } from '@/components/cards/AddCard';
import { BookmarkCard } from '@/components/cards/BookmarkCard';
import { mockData } from '@/data/mockData';

import { useModal } from '@/components/providers/ModalProvider';
import useSWR from 'swr';
import { fetcher } from '@/helper/fetcher';
import { IFolderClient } from '@/types/folder';
import { IBookmarkClient } from '@/types/bookmark';

interface FolderPageClientProps {
    id: string;
}

export default function FolderPageClient({ id }: FolderPageClientProps) {
    const currentFolderId = id;
    const { data: rootFolders, error: rootFolderError, isLoading: rootFolderLoading } = useSWR(["/api/folders/", {}], fetcher);
    const { data: folder, error: folderError, isLoading: folderLoading } = useSWR(["/api/folders/" + id, {}], fetcher);
    const { data: bookmarks, error: bookmarksError, isLoading: bookmarksLoading } = useSWR(["/api/bookmarks/" + id, {}], fetcher);
    console.log({ folder })
    console.log({ bookmarks })
    const { openAddFolder, openAddBookmark } = useModal();


    return (
        <div className="flex h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <div className="w-64 border-r bg-card p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Folders</h3>
                <FolderTree
                    folders={rootFolders}
                    currentFolderId={currentFolderId}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    <div className='md:flex justify-between'>

                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-2">
                                {folder ? folder.name : 'All Bookmarks'}
                            </h2>
                            {folder?.description && (
                                <p className="text-muted-foreground">{folder.description}</p>
                            )}

                        </div>
                        <div className='md:flex gap-3'>
                            {/* TODOS: add the small btn on the heading of the page  */}
                            {/* <AddCard type="folder" onClick={() => setShowAddFolderModal(true)} />
                            <AddCard type="bookmark" onClick={() => setShowAddBookmarkModal(true)} /> */}

                        </div>
                    </div>

                    {/* Subfolders */}
                    {folder?.subfolders?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-4">Folders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {folder?.subfolders?.map((folder: IFolderClient) => (
                                    <FolderCard
                                        key={folder._id}
                                        folder={folder}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bookmarks */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4">
                            {folder ? 'Bookmarks in this folder' : 'Recent Bookmarks'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AddCard type="folder" onClick={() => openAddFolder(id)} />
                            <AddCard type="bookmark" onClick={() => openAddBookmark(id)} />

                            {bookmarks?.map((bookmark: IBookmarkClient) => (
                                <BookmarkCard key={bookmark._id} bookmark={bookmark} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
