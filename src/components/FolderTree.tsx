'use client'
import React, { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Home, 
  MoreHorizontal,
  FolderOpen
} from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/helper/fetcher';
import { useRouter } from 'next/navigation';

// --- Types ---
// Matching the structure returned by our optimized API
interface IFolder {
  _id: string;
  name: string;
  icon?: string;
  children?: IFolder[]; // The API converts subFolders -> children for the tree
}



// --- Components ---

// 1. Recursive Folder Item Component
const FolderItem = ({ 
  folder, 
  depth = 0, 
  activeId, 
  onSelect 
}: { 
  folder: IFolder; 
  depth?: number; 
  activeId: string; 
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const router = useRouter();
  // Base indentation + depth indentation
  const paddingLeft = `${depth * 16 + 12}px`;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onSelect(folder._id);
    router.push(`/folder/${folder._id}`);
  };

  return (
    <div className="select-none">
      <div 
        className={`
          group flex items-center pr-3 py-1.5 my-0.5
          text-sm font-medium rounded-md cursor-pointer transition-colors duration-200
          ${activeId === folder._id 
            ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100' 
            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'}
        `}
        style={{ paddingLeft }}
        onClick={handleToggle}
      >
        {/* Chevron / Spacer */}
        <span 
          className={`
            mr-1 flex items-center justify-center w-4 h-4 rounded-sm 
            hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors
            ${hasChildren ? 'visible' : 'invisible'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <ChevronDown size={14} className="text-slate-400" />
          ) : (
            <ChevronRight size={14} className="text-slate-400" />
          )}
        </span>

        {/* Icon */}
        <span className="mr-2 text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300">
          {isOpen&&hasChildren ? <FolderOpen size={16} /> : <Folder size={16} />}
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
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
    const { data: foldersTree, error: foldersTreeError, isLoading: foldersTreeLoading } = useSWR(["/api/folders/tree", {}], fetcher);
  console.log("FolderTree: ", foldersTree);
  return (
    <div className="w-full max-w-xs h-[500px] border-r border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 p-4 font-sans">
      <div className="mb-4 px-2">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Folders
        </h2>
      </div>

      <nav className="space-y-1">
        {/* "All Bookmarks" Static Item */}
        <div 
          onClick={() => setActiveFolderId("all")}
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

        {/* Recursive Tree */}
        <div className="space-y-0.5">
          {foldersTree?.map((folder:IFolder) => (
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