"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder as FolderIcon, Home } from 'lucide-react';
import { Folder } from '@/types';
import { Button } from './ui/button';
import { useFolderNavigation } from '@/hook/useFolderNavigation';

interface FolderTreeProps {
  folders: Folder[];
  currentFolderId?: string;
}

interface TreeNodeProps {
  folder: Folder;
  children: Folder[];
  level: number;
  currentFolderId?: string;
  expandedFolders: Set<string>;
  toggleExpanded: (folderId: string) => void;
}

function TreeNode({
  folder,
  children,
  level,
  currentFolderId,
  expandedFolders,
  toggleExpanded
}: TreeNodeProps) {
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = currentFolderId === folder.id;
  const hasChildren = children.length > 0;
  const { goToFolder } = useFolderNavigation();
  return (
    <div>
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className="w-full justify-start h-auto p-2 font-normal"
        style={{ paddingLeft: `${8 + level * 16}px` }}
      onClick={() => goToFolder(folder.id)}
      >
        <div className="flex items-center gap-2 w-full">
          {hasChildren && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(folder.id);
              }}
              className="p-0.5 hover:bg-accent rounded-sm"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          {!hasChildren && <div className="w-4" />}
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{folder.name}</span>
        </div>
      </Button>
      {hasChildren && isExpanded && (
        <div>
          {children.map((childFolder) => {
            const grandChildren = folder.id ? [] : []; // Simplified for this demo
            return (
              <TreeNode
                key={childFolder.id}
                folder={childFolder}
                // children={grandChildren}
                level={level + 1}
                currentFolderId={currentFolderId}
                expandedFolders={expandedFolders}
                toggleExpanded={toggleExpanded}
              >{grandChildren}</TreeNode>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FolderTree({ folders, currentFolderId }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const rootFolders = folders?.filter(f => !f.parentId);

  return (
    <div className="space-y-1">
      <Button
        variant={!currentFolderId ? "secondary" : "ghost"}
        className="w-full justify-start h-auto p-2 font-normal"
      // onClick={() => onFolderSelect(undefined)}
      >
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span>All Bookmarks</span>
        </div>
      </Button>

      {rootFolders?.map((folder) => {
        const children = folders.filter(f => f.parentId === folder.id);
        return (
          <TreeNode
            key={folder.id}
            folder={folder}
            // children={children}
            level={0}
            currentFolderId={currentFolderId}
            expandedFolders={expandedFolders}
            toggleExpanded={toggleExpanded}
          >{children}</TreeNode>
        );
      })}
    </div>
  );
}