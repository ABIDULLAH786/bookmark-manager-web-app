"use client"
import { Folder as FolderIcon, MoreVertical } from 'lucide-react';
import { Card, CardContent } from './Card';
import { useFolderNavigation } from '@/hook/useFolderNavigation';
import { Button } from '../ui/button';
import { IFolderClient } from '@/types/folder';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { FolderDropDown } from './FolderDropDown';

interface FolderCardProps {
  folder: IFolderClient;
}

export function FolderCard({ folder }: FolderCardProps) {
  const { goToFolder } = useFolderNavigation();
  return (
    <Card className="group hover:bg-slate-50 dark:hover:bg-slate-900 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => goToFolder(folder?._id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{folder.name}</h3>
              <p className="text-sm text-muted-foreground">
                {folder?.stats?.totalItems} {folder?.stats?.totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div
            className="opacity-100 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <FolderDropDown folder={folder}/>
          </div>
      
        </div>
        {folder.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{folder.description}</p>
        )}
      </CardContent>
    </Card>
  );
}