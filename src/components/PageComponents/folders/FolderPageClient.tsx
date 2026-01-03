"use client";

import { FolderCard } from '@/components/cards/FolderCard';
import { AddCard } from '@/components/cards/AddCard';
import { BookmarkCard } from '@/components/cards/BookmarkCard';
import { useModal } from '@/components/providers/ModalProvider';
import useSWR from 'swr';
import { fetcher } from '@/helper/fetcher';
import { IFolderClient } from '@/types/folder';
import { IBookmarkClient } from '@/types/bookmark';
import { Card } from '../../cards/Card';
import { Separator } from '../../ui/separator';
import { useEffect } from 'react';
import { useFolderStore } from '@/store/folders.store';
import { API_PATHS } from '@/lib/apiPaths';
import { PageMainAreaSkeleton } from '../../loaders/FolderPageSkeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FolderPageClientProps {
    id: string;
}

export default function FolderPageClient({ id }: FolderPageClientProps) {
    const { setSingleSelectedFolder, singleSelectedFolder } = useFolderStore()
    const { data: singleFolder, error: singleFolderError, isLoading: singleFolderLoading } = useSWR([API_PATHS.FOLDERS.DETAIL(id).url, {}], fetcher);
    const { openAddFolder, openAddBookmark } = useModal();

    useEffect(() => {
        if (singleFolder)
            setSingleSelectedFolder(singleFolder)
    }, [singleFolder])

    if (singleFolderError) console.error(singleFolderError)
    if (singleFolderLoading) return <PageMainAreaSkeleton />

    return (
        <div className="flex h-[calc(100vh-60px)]">
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-8 bg-green-300">

                    {/* --- HEADER SECTION START --- */}
                    <Card className='flex flex-col sm:flex-row md:items-center justify-between border-none gap-10'>

                        {/* Left Side: Text (Name & Description) */}
                        <div className="flex-1 min-w-0">

                            <h2 className="text-2xl font-semibold truncate cursor-default ">
                                {singleSelectedFolder ? singleSelectedFolder?.name : 'All Bookmarks'}
                            </h2>

                            {singleSelectedFolder?.description && (
                                <p className="text-muted-foreground truncate cursor-default">
                                    {singleSelectedFolder?.description}
                                </p>
                            )}
                        </div>

                        {/* Right Side: Buttons */}
                        <div className='flex flex-col  sm:flex-row gap-1 md:gap-3 shrink-0'>
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
                                    <FolderCard key={folder._id} folder={folder} />
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