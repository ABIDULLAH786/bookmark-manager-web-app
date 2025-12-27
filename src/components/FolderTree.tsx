'use client'
import React, { useEffect, useState } from 'react';
import {
  Folder,
  ChevronRight,
  ChevronDown,
  Home,
  FolderOpen
} from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/helper/fetcher';
import { useParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { API_PATHS } from '@/lib/apiPaths';
import { useFolderStore } from '@/store/folders.store';
import { useFoldersTreeStore } from '@/store/folderTree.store';
import { IFolderTreeClient } from '@/types';
import { FolderTreeSkeleton } from './loaders/FolderTreeSkeleton';

// --- Helper Functions ---
/**
 * Recursively checks if a folder contains the activeId in its descendants.
 */
const isActivePath = (folder: IFolderTreeClient, activeId: string): boolean => {
  if (folder.children?.some(child => child._id === activeId)) {
    return true;
  }
  if (folder.children?.some(child => isActivePath(child, activeId))) {
    return true;
  }
  return false;
};

// --- Components ---

// 1. Recursive Folder Item Component
const FolderItem = ({
  folder,
  depth = 0,
  activeId,
  onSelect
}: {
  folder: IFolderTreeClient;
  depth?: number;
  activeId: string;
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const router = useRouter();

  const paddingLeft = `${depth * 16 + 12}px`;
  const isSelected = activeId === folder._id;

  // --- Auto-Expand Lifecycle ---
  useEffect(() => {
    // Expand if:
    // 1. One of my children is the active folder
    // 2. OR: I am the active folder (so I show my own children)
    if (hasChildren && (isActivePath(folder, activeId) || activeId === folder._id)) {
      setIsOpen(true);
    }
  }, [activeId, folder, hasChildren]);

  // --- Handlers ---

  // Handler for clicking the Main Row (Name/Icon)
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();

    // UI Decision: Clicking the name should SELECT and OPEN.
    // It should NOT toggle close. To close, use the Chevron.
    if (hasChildren) {
      setIsOpen(true);
    }

    onSelect(folder._id);
    router.push(`/dashboard/folder/${folder._id}`);
  };

  // Handler for clicking the Chevron (Arrow) only
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This allows the user to close the folder manually without changing selection
    setIsOpen(!isOpen);
  };

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center pr-3 py-1.5 my-0.5
          text-sm font-medium rounded-md cursor-pointer transition-colors duration-200
          ${isSelected
            ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'}
        `}
        style={{ paddingLeft }}
        onClick={handleSelect} // Main click triggers selection & open
      >
        {/* Chevron / Spacer */}
        <span
          className={`
            mr-1 flex items-center justify-center w-4 h-4 rounded-sm 
            hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10
            ${hasChildren ? 'visible' : 'invisible'}
          `}
          onClick={handleToggleClick} // Specific click triggers toggle
        >
          {isOpen ? (
            <ChevronDown size={14} className="text-slate-400" />
          ) : (
            <ChevronRight size={14} className="text-slate-400" />
          )}
        </span>

        {/* Icon */}
        <span className="mr-2 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300">
          {isOpen && hasChildren ? <FolderOpen size={16} /> : <Folder size={16} />}
        </span>

        {/* Name */}
        <span className="truncate flex-1">{folder.name}</span>
      </div>

      {/* Recursive Children Rendering */}
      {isOpen && hasChildren && (
        <div className="flex flex-col">
          {folder.children!.map((child) => (
            <FolderItem
              key={child._id}
              folder={child}
              depth={depth + 1}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Main Sidebar Component
export default function FolderTree() {
  const { id } = useParams();
  const router = useRouter();
  const { setFoldersTree, foldersTree } = useFoldersTreeStore();
  const [activeFolderId, setActiveFolderId] = useState<string>(id as string);
  const { data, error: foldersTreeError, isLoading: foldersTreeLoading } = useSWR([API_PATHS.FOLDERS.NESTED("/tree").LIST().url, {}], fetcher);
  console.log("foldersTree: ", foldersTree)
  // Sync state with URL parameter
  useEffect(() => {
    if (id) {
      setActiveFolderId(id as string);
    } else {
      setActiveFolderId("all");
    }
  }, [id]);
  useEffect(() => {
    if (data) {
      setFoldersTree(data);
    }
  }, [data])

  if (foldersTreeError) {
    console.error(foldersTreeError);
  }

  if (foldersTreeLoading) {
    return <FolderTreeSkeleton />
  }

  return (
    <div className="w-full max-w-xs overflow-y-auto no-scrollbar font-sans">
      <div className="px-2 py-2">
        <div
          onClick={() => {
            setActiveFolderId("all");
            router.push('/dashboard/folder');
          }}
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
            transition-colors duration-200 mb-4
            ${activeFolderId === "all"
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'}
          `}
        >
          <Home size={16} className="mr-3 text-slate-400" />
          All Bookmarks
        </div>
      </div>

      <nav className="space-y-1">


        <div className="space-y-0.5">
          {!foldersTreeLoading && foldersTree?.map((folder: IFolderTreeClient) => (
            <FolderItem
              key={folder._id}
              folder={folder}
              activeId={activeFolderId}
              onSelect={setActiveFolderId}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}