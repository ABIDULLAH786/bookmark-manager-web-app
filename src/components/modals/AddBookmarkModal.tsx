import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Bookmark } from '@/types';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface AddBookmarkModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: Bookmark) => void;
  // onSubmit: (title: string, url: string, description: string) => void;
}

export function AddBookmarkModal({ open, onClose, onSubmit }: AddBookmarkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      const newBookmark = {id: Date.now().toString(), title: title.trim(), url: url.trim(), description: description.trim(), createdAt: new Date()};
      if (onSubmit) onSubmit(newBookmark);
      setTitle('');
      setUrl('');
      setDescription('');
      onClose();
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !url.trim()}>
              Save Bookmark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}