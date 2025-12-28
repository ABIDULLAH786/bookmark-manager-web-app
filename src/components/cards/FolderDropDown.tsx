"use client"

import { useState } from "react"
import { MoreVertical, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from 'nextjs-toploader/app';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IFolderClient } from "@/types" // Adjust path to your types
import { API_PATHS } from "@/lib/apiPaths" // Adjust path
import { useFolderStore } from "@/store/folders.store" // Adjust path
import { useFoldersTreeStore } from "@/store/folderTree.store"

interface FolderDropDownProps {
  folder: IFolderClient;
}

export function FolderDropDown({ folder }: FolderDropDownProps) {
  const router = useRouter()
  const params = useParams()
  
  // Local UI State
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [folderFormData, setFolderFormData] = useState<IFolderClient>(folder)
  const [isLoading, setIsLoading] = useState(false)

  // Global Store Actions
  const { 
   
    // all/root folder ste
    removeFolder,

    // single folder state
    updateSubFolderInSelected, 
    removeSubFolderFromSelected,
    singleSelectedFolder
  } = useFolderStore()
  const { updateFolderInTree, removeFolderFromTree } = useFoldersTreeStore()

  // --- 1. Handle Update (PATCH) ---
  const handleUpdateFolder = async () => {
    setIsLoading(true);
    try {
      const apiInfo = API_PATHS.FOLDERS.PATCH(folder._id!);
      
      const res = await fetch(apiInfo.url, {
        method: apiInfo.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderFormData.name,
          description: folderFormData.description
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      const { data: updatedFolder } = await res.json();

      // A. Update Sidebar Tree
      updateFolderInTree(updatedFolder);

      // B. Update Main View Grid (if applicable)
      updateSubFolderInSelected(updatedFolder);

      setShowUpdateDialog(false);
    } catch (error) {
      console.error(error);
      // Optional: toast.error("Failed to update folder")
    } finally {
      setIsLoading(false);
    }
  }

  // --- 2. Handle Delete (DELETE) ---
  const handleDeleteFolder = async () => {
    setIsLoading(true);
    try {
      const apiInfo = API_PATHS.FOLDERS.DELETE(folder._id!);
      
      const res = await fetch(apiInfo.url, {
        method: apiInfo.method,
      });

      if (!res.ok) throw new Error("Failed to delete");

      // A. Remove from Sidebar Tree
      removeFolderFromTree(folder._id!);

      // B. Remove from Main View Grid
      if(!folder.parentFolder) {
        removeFolder(folder._id!);
      }else{ 
        removeSubFolderFromSelected(folder._id!);
      }

      // C. Redirect if we are currently INSIDE the deleted folder
      // logic: if the URL param ID matches the deleted folder ID
      if (params?.id === folder._id) {
         router.push('/dashboard/folder/all');
      }

      setShowDeleteDialog(false);
    } catch (error) {
      console.error(error);
      // Optional: toast.error("Failed to delete folder")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* --- Dropdown Menu --- */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="icon-sm" className="h-8 w-8 bg-surface">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-surface" align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowUpdateDialog(true)} className="cursor-pointer">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600 dark:focus:bg-red-800/10 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- Update Dialog --- */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Folder</DialogTitle>
            <DialogDescription>
              Update the name or description of your folder.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3 space-y-4">
            <Field>
              <FieldLabel htmlFor="foldername">Folder Name</FieldLabel>
              <Input
                id="foldername"
                value={folderFormData.name}
                onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
              <Textarea
                id="description"
                value={folderFormData.description || ''}
                onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })}
                disabled={isLoading}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFolder} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Dialog --- */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure? This will permanently delete <strong>{folder.name}</strong> and all its contents (bookmarks & subfolders).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteFolder} 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}