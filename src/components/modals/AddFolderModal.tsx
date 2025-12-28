import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetcher } from '@/helper/fetcher';
import { IError } from '@/types/error';
import { useFolderStore } from '@/store/folders.store';
import { API_PATHS } from '@/lib/apiPaths';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import { useFoldersTreeStore } from '@/store/folderTree.store';
import { cn } from "@/lib/utils"; // Standard shadcn utility for class merging
import { MAX_DESC_LENGTH, MAX_TITLE_LENGTH } from '@/constants';

interface AddFolderModalProps {
  open: boolean;
  onClose: () => void;
  parentFolderId?: string;
}

export function AddFolderModal({ open, onClose, parentFolderId }: AddFolderModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { addFolder, addSubFolderToSelected } = useFolderStore();
  const { addFolderToTree } = useFoldersTreeStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. Validation Helpers
  const isNameInvalid = name.length > MAX_TITLE_LENGTH;
  const isDescInvalid = description.length > MAX_DESC_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "unauthenticated" || !session?.user) {
      onClose();
      return router.push("/login");
    }

    // 3. Validation Check on Submit
    if (isNameInvalid) {
      setErrorMsg(`Folder name cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }
    if (isDescInvalid) {
      setErrorMsg(`Description cannot exceed ${MAX_DESC_LENGTH} characters.`);
      return;
    }
    if (!name.trim()) return;

    setLoading(true);
    setErrorMsg(null); // Clear previous errors

    try {
      const { url, method } = API_PATHS.FOLDERS.CREATE();

      const res = await fetcher([
        url,
        {
          method: method as HTTP_METHOD,
          body: {
            name,
            description,
            parentFolder: parentFolderId,
            createdAt: new Date(),
            createdBy: (session.user as any).id
          },
        },
      ]);

      const updateFolderData = {
        ...res,
        stats: { subFolders: 0, bookmarks: 0, totalItems: 0 }
      };

      if (parentFolderId) {
        addSubFolderToSelected(updateFolderData);
      }
      addFolder(updateFolderData);

      addFolderToTree({
        _id: updateFolderData._id,
        name: updateFolderData.name,
        children: [],
        parentFolder: updateFolderData.parentFolder
      });

      handleClose();

    } catch (err: IError | any) {
      console.log("Error body:", err.body);
      setErrorMsg(err?.body?.errors[0] ?? err.body?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* --- NAME INPUT --- */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="folder-name">Name *</Label>
                <span className={cn("text-xs", isNameInvalid ? "text-red-500 font-bold" : "text-muted-foreground")}>
                    {name.length}/{MAX_TITLE_LENGTH}
                </span>
            </div>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter folder name"
              required
              // 4. Conditional Styling for Red Border
              className={cn(
                  isNameInvalid && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>

          {/* --- DESCRIPTION INPUT --- */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <Label htmlFor="folder-description">Description</Label>
                <span className={cn("text-xs", isDescInvalid ? "text-red-500 font-bold" : "text-muted-foreground")}>
                    {description.length}/{MAX_DESC_LENGTH}
                </span>
            </div>
            <Textarea
              id="folder-description"
              value={description}
              onChange={(e) => {
                  setDescription(e.target.value);
                  if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Optional description"
              rows={3}
              // 4. Conditional Styling for Red Border
              className={cn(
                  isDescInvalid && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>

          <DialogFooter className='flex items-center justify-between!'>
            <div className='flex-1 pr-2'>
              {errorMsg && <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {/* Disable button if invalid to prevent clicking entirely (Optional UX choice) */}
              <Button type="submit" disabled={!name.trim() || loading || isNameInvalid || isDescInvalid}>
                {loading ? "Creating..." : "Create Folder"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}