import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { IFolderClient } from '@/types/folder';
import { mutate } from 'swr';
import { fetcher } from '@/helper/fetcher';
import { IError } from '@/types/error';

interface AddFolderModalProps {
  open: boolean;
  onClose: () => void;
  // onSubmit: (name: string, description: string) => void;
  // onSubmit?: (data: IFolderClient) => void;
  parentFolderId: string;
}

export function AddFolderModal({ open, onClose, parentFolderId }: AddFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetcher([
        "/api/folders",
        {
          method: "POST",
          body: {
            name,
            description,
            parentFolder: parentFolderId,
            createdAt: new Date(),
            createdBy: "68f78b4cc6f131811e4f01b2" // TODO: replace with real loggedin user ID
          },
        },
      ]);
      console.log("response: ", res);


      // optional: refresh folders via SWR
      // mutate(parentFolderId ? `/api/folders/${parentFolderId}` : "/api/folders");

      setName("");
      setDescription("");
      onClose();
      // return
      if (name.trim()) {
        // onSubmit(name.trim(), description.trim());

        // const newFolder = { id: Date.now().toString(), name: name.trim(), description: description.trim(), createdAt: new Date() };
        setName('');
        setDescription('');
        onClose();
      }
    } catch (err: IError | any) {
      console.log("Error body:", err.body);
      setErrorMsg(err?.body?.errors[0] ?? err.body.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
    setErrorMsg(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Name *</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-description">Description</Label>
            <Textarea
              id="folder-description"
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
              <Button type="submit" disabled={!name.trim()}>
                {loading ? "Creating..." : "Create Folder"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}