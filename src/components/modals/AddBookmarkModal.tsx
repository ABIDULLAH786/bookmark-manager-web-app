import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useBookmarkStore } from '@/store/bookmarks';
import { useFolderStore } from '@/store/folders.store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/helper/fetcher';
import { IError } from '@/types/error';
import { cn } from "@/lib/utils"; // Import utility for class merging
import { MAX_DESC_LENGTH, MAX_TITLE_LENGTH } from '@/constants';

interface AddBookmarkModalProps {
  open: boolean;
  onClose: () => void;
  parentFolderId?: string;
}

export function AddBookmarkModal({ open, onClose, parentFolderId }: AddBookmarkModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { addBookmark } = useBookmarkStore();
  const { addBookmarkToSelected } = useFolderStore();
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTitleInvalid = title.length > MAX_TITLE_LENGTH;
  const isDescInvalid = description.length > MAX_DESC_LENGTH;

  const handleCreateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
     
    // Security Check
    if (status === "unauthenticated" || !session?.user) {
        onClose(); 
        return router.push("/login");
    }

    // Validation Check on Submit
    if (isTitleInvalid) {
        setErrorMsg(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
        return;
    }
    if (isDescInvalid) {
        setErrorMsg(`Description cannot exceed ${MAX_DESC_LENGTH} characters.`);
        return;
    }

    if (!title.trim() || !url.trim()) return;
    
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await fetcher([
        "/api/bookmarks",
        {
          method: "POST",
          body: {
            title,
            url,
            description,
            parentFolder: parentFolderId,
            createdAt: new Date(),
            createdBy: (session.user as any).id 
          },
        },
      ]);
      
      console.log("Bookmark added: ", data);

      if(parentFolderId) {
        addBookmarkToSelected(data);
      } else {
        addBookmark(data);
      }
      
      handleClose();

    } catch (err: IError | any) {
      console.log("Error creating bookmark:", err);
      setErrorMsg(err?.body?.errors[0] ?? err.body?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        
        {/* Fixed the typo in className here */}
        <form onSubmit={handleCreateBookmark} className="space-y-4">
          
          {/* --- TITLE INPUT --- */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="bookmark-title">Title *</Label>
                <span className={cn("text-xs", isTitleInvalid ? "text-red-500 font-bold" : "text-muted-foreground")}>
                    {title.length}/{MAX_TITLE_LENGTH}
                </span>
            </div>
            <Input
              id="bookmark-title"
              value={title}
              onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter bookmark title"
              required
              className={cn(
                  isTitleInvalid && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>

          {/* --- URL INPUT --- */}
          <div className="space-y-2">
            <Label htmlFor="bookmark-url">URL *</Label>
            <Input
              id="bookmark-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          {/* --- DESCRIPTION INPUT --- */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="bookmark-description">Description</Label>
                <span className={cn("text-xs", isDescInvalid ? "text-red-500 font-bold" : "text-muted-foreground")}>
                    {description.length}/{MAX_DESC_LENGTH}
                </span>
            </div>
            <Textarea
              id="bookmark-description"
              value={description}
              onChange={(e) => {
                  setDescription(e.target.value);
                  if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Optional description"
              rows={3}
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
              <Button 
                type="submit" 
                disabled={!title.trim() || !url.trim() || loading || isTitleInvalid || isDescInvalid}
              >
                {loading ? "Saving..." : "Save Bookmark"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}