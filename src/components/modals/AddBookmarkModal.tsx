import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { IBookmarkClient } from '@/types/bookmark';
import { mutate } from 'swr';
import { fetcher } from '@/helper/fetcher';
import { IError } from '@/types/error';
import { USER_ID } from '@/constants';

interface AddBookmarkModalProps {
  open: boolean;
  onClose: () => void;
  // onSubmit?: (data: IBookmarkClient) => void;
  // onSubmit: (title: string, url: string, description: string) => void;
  parentFolderId?: string;
}

export function AddBookmarkModal({ open, onClose, parentFolderId }: AddBookmarkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleCreateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setLoading(true);
    try {
      await fetcher([
        "/api/bookmarks",
        {
          method: "POST",
          body: {
            title,
            url,
            description,
            parentFolder: parentFolderId,
            createdAt: new Date(),
            createdBy: USER_ID // TODO: replace with real loggedin user ID

          },
        },
      ]);

      mutate(parentFolderId ? `/api/bookmarks/${parentFolderId}` : "/api/bookmarks");

      setTitle("");
      setUrl("");
      setDescription("");
      onClose();
    } catch (err: IError | any) {
      console.log("Error creating bookmark:", err);
      console.log("Error body:", err.body);
      setErrorMsg(err?.body?.errors[0] ?? err.body.message);

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateBookmark} className="space-y-4 : React.FormEventespace-y-4
        e.preventDefault();">
          <div className="space-y-2">
            <Label htmlFor="bookmark-title">Title *</Label>
            <Input
              id="bookmark-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bookmark title"
              required
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="bookmark-description">Description</Label>
            <Textarea
              id="bookmark-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <DialogFooter className='flex items-center justify-between!'>
            <div className=''>
              {errorMsg && <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>}
            </div>
            <div>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || !url.trim()}>
                {loading ? "Saving..." : "Save Bookmark"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}