"use client"

import { useState } from "react"
import { MoreVertical, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

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
import { IBookmarkClient } from "@/types" // Adjust path to your types
import { API_PATHS } from "@/lib/apiPaths" // Adjust path
import { useFolderStore } from "@/store/folders.store" // Adjust path
import { toast } from "sonner"
import { useBookmarkStore } from "@/store/bookmarks"

interface BookmarkDropDownProps {
  bookmark: IBookmarkClient;
}

export function BookmarkDropDown({ bookmark }: BookmarkDropDownProps) {
  const router = useRouter()
  const params = useParams()
  
  // Local UI State
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [bookmarkFormData, setBookmarkFormData] = useState<IBookmarkClient>(bookmark)
  const [isLoading, setIsLoading] = useState(false)

  // Global Store Actions
  const { 
    // single folder state handle for bookmark
    singleSelectedFolder,
    updateBookmarkInSelected,
    removeBookmarkFromSelected,
  } = useFolderStore()
  const {updateBookmark} = useBookmarkStore()

  // --- 1. Handle Update (PATCH) ---
  const handleUpdateFolder = async () => {
    setIsLoading(true);
    try {
      const apiInfo = API_PATHS.BOOKMARKS.PATCH(bookmark._id!);
      
      const res = await fetch(apiInfo.url, {
        method: apiInfo.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: bookmarkFormData.title,
          description: bookmarkFormData.description,
          url: bookmarkFormData.url
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      const { data: updatedBookmark } = await res.json();
      console.log("updatedBookmark: ", updatedBookmark)
      if(bookmark?.parentFolder){
        updateBookmarkInSelected(updatedBookmark);
      }else{
        updateBookmark(updatedBookmark)
      }
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
      const apiInfo = API_PATHS.BOOKMARKS.DELETE(bookmark._id!);
      
      const res = await fetch(apiInfo.url, {
        method: apiInfo.method,
      });

      if (!res.ok) throw new Error("Failed to delete bookmark");

      // A. Remove bookmark from sekected folder
      removeBookmarkFromSelected(bookmark._id!);


      setShowDeleteDialog(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete bookmark")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* --- Dropdown Menu --- */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="icon-sm" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Bookmark Actions</DropdownMenuLabel>
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
            <DialogTitle>Update Bookmark</DialogTitle>
            <DialogDescription>
              Update the title or url of the bookmark.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3 space-y-4">
            <Field>
              <FieldLabel htmlFor="bookmarkTitle">Bookmark Title</FieldLabel>
              <Input
                id="bookmarkTitle"
                value={bookmarkFormData.title}
                onChange={(e) => setBookmarkFormData({ ...bookmarkFormData, title: e.target.value })}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bookmarkUrl">Bookmark URL</FieldLabel>
              <Input
                id="bookmarkUrl"
                value={bookmarkFormData.url}
                onChange={(e) => setBookmarkFormData({ ...bookmarkFormData, url: e.target.value })}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
              <Textarea
                id="description"
                value={bookmarkFormData.description || ''}
                onChange={(e) => setBookmarkFormData({ ...bookmarkFormData, description: e.target.value })}
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
              Are you sure? This will permanently delete <strong>{bookmark.title}</strong>.
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