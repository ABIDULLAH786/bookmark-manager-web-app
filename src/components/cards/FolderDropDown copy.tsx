"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"

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
import { IFolderClient } from "@/types"

interface FolderDropDownProps {
  folder: IFolderClient;
}
export function FolderDropDown({ folder }: FolderDropDownProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [folderFormData, setFolderFormData] = useState<IFolderClient>(folder)

  const handleUpdateFolder = () => {

  }
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="icon-sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Folder</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="foldername">Folder Name</FieldLabel>
              <Input
                id="foldername"
                type="text"
                name="foldername"
                placeholder="document.txt"
                value={folderFormData.name}
                onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Description of the folder..."
                value={folderFormData.description}
                onChange={(e) => setFolderFormData({ ...folderFormData, description: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Do you relly want to delete this folder? You can&apos;t undo this.
              All subfolders and bookmarks will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
