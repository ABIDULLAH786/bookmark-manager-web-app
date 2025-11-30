"use client";

import { FolderCard } from '@/components/cards/FolderCard';
import { AddCard } from '@/components/cards/AddCard';
import { BookmarkCard } from '@/components/cards/BookmarkCard';

import { useModal } from '@/components/providers/ModalProvider';
import useSWR from 'swr';
import { fetcher } from '@/helper/fetcher';
import { IFolderClient } from '@/types/folder';
import { IBookmarkClient } from '@/types/bookmark';
import FolderTree from '../FolderTree';
import { Card } from '../cards/Card';
import { Separator } from '../ui/separator';
import { useEffect } from 'react';
import { useFoldersStore } from '@/store/folders.store';
import { API_PATHS } from '@/lib/apiPaths';

interface FolderPageClientProps {
    id: string;
}

export default function FolderPageClient({ id }: FolderPageClientProps) {
    const { setSingleSelectedFolder, singleSelectedFolder } = useFoldersStore()
    const { data: singleFolder, error: singleFolderError, isLoading: singleFolderLoading } = useSWR([API_PATHS.FOLDERS.DETAIL(id).url, {}], fetcher);
    // const { data: bookmarks, error: bookmarksError, isLoading: bookmarksLoading } = useSWR([API_PATHS.BOOKMARKS.DETAIL(id).url, {}], fetcher);
    console.log({ singleFolder })
    console.log({ SubFolderbookmarks: singleFolder?.bookmarks })
    const { openAddFolder, openAddBookmark } = useModal();

    useEffect(() => {
        if (singleFolder)
            setSingleSelectedFolder(singleFolder)
    }, [singleFolder])
    return (
        <div className="flex h-[calc(100vh-80px)]">
            <FolderTree id={id} />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* Heading */}
                    <Card className='md:flex flex-row items-center justify-between border-none'>

                        <div className="">
                            <h2 className="text-2xl font-semibold">
                                {singleSelectedFolder ? singleSelectedFolder.name : 'All Bookmarks'}
                            </h2>
                            {singleSelectedFolder?.description && (
                                <p className="text-muted-foreground">{singleSelectedFolder.description}</p>
                            )}

                        </div>
                        <div className='md:flex gap-3'>
                            {/* TODOS: add the small btn on the heading of the page  */}
                            <AddCard type="folder" onClick={() => openAddFolder(id)} />
                            <AddCard type="bookmark" onClick={() => openAddBookmark(id)} />

                        </div>
                    </Card>
                    <Separator className="mt-4 mb-8" />

                    {/* Subfolders */}
                   {(singleSelectedFolder?.subFolders?.length ?? 0) > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-4">Folders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {singleSelectedFolder?.subFolders?.map((folder: IFolderClient) => (
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
                            {singleSelectedFolder ? 'Bookmarks in this folder' : 'Recent Bookmarks'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {singleSelectedFolder?.bookmarks?.map((bookmark: IBookmarkClient) => (
                                <BookmarkCard key={bookmark._id} bookmark={bookmark} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
