import React, { useState, useEffect, useRef } from 'react';
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
import { cn } from "@/lib/utils";
import { MAX_DESC_LENGTH, MAX_TITLE_LENGTH } from '@/constants';
import { Upload, X } from 'lucide-react'; // Import icons
import { API_PATHS } from '@/lib/apiPaths';
import { HTTP_METHOD } from 'next/dist/server/web/http';

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

  // Icon States
  const [icon, setIcon] = useState<string>(''); // Stores the Base64 string
  const [preview, setPreview] = useState<string>(''); // Stores the visual preview URL
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTitleInvalid = title.length > MAX_TITLE_LENGTH;
  const isDescInvalid = description.length > MAX_DESC_LENGTH;

  // 1. Auto-generate default preview when URL changes (if no custom icon selected)
  useEffect(() => {
    if (!url || icon) return; // Don't override if user uploaded a custom icon

    // Simple regex to check if URL is valid-ish before trying to fetch icon
    const isValidUrl = url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isValidUrl) {
      // Use Google's S2 service for a visual default preview
      // Note: We can't easily convert this to Base64 on client due to CORS, 
      // so this is just for the user to "see" a default.
      // If you want the backend to store this specific image, the backend should fetch it.
      const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      setPreview(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
    } else {
      setPreview('');
    }
  }, [url, icon]);

  // 2. Handle File Selection (Convert to Base64)
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., limit to 100KB to prevent huge DB payloads)
      if (file.size > 100 * 1024) {
        setErrorMsg("Icon size too large. Max 100KB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setIcon(base64String); // Store payload
        setPreview(base64String); // Update UI
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIcon = () => {
    setIcon('');
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "unauthenticated" || !session?.user) {
      onClose();
      return router.push("/login");
    }

    if (isTitleInvalid || isDescInvalid) return;
    if (!title.trim() || !url.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { url: apiEndPoint, method } = API_PATHS.BOOKMARKS.CREATE();

      const data = await fetcher([
        apiEndPoint,
        {
          method: method as HTTP_METHOD,
          body: {
            title,
            url,
            description,
            parentFolder: parentFolderId,
            createdAt: new Date(),
            createdBy: (session.user as any).id,
            // 3. Send the Base64 icon if it exists
            icon: icon || undefined
          },
        },
      ]);

      console.log("Bookmark added: ", data);

      if (parentFolderId) {
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
    setIcon('');
    setPreview('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateBookmark} className="space-y-4">

          {/* --- TITLE --- */}
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
              className={cn(isTitleInvalid && "border-red-500 focus-visible:ring-red-500")}
            />
          </div>

          {/* --- URL --- */}
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

          {/* --- ICON SELECTION --- */}
          <div className="space-y-2">
            <Label>Icon (Optional)</Label>
            <div className="flex items-center gap-4">
              {/* Preview Box */}
              <div className="max-w-12 max-h-12 rounded-lg bg-transparent flex items-center justify-center overflow-hidden shrink-0 relative group">
                {preview ? (
                  <img src={preview} alt="Icon preview" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-xl">🔗</span>
                )}
                {/* Remove button if custom icon is set */}
                {icon && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleRemoveIcon}
                  >
                    <X className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/x-icon, image/svg+xml"
                  className="hidden"
                  onChange={handleIconChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {icon ? "Change Icon" : "Upload Custom Icon"}
                </Button>
                <p className="text-[8px]! text-muted-foreground mt-1">
                  {icon ? "Custom icon selected (Base64)" : "Default icon will be used if empty"}
                </p>
              </div>
            </div>
          </div>

          {/* --- DESCRIPTION --- */}
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
              className={cn(isDescInvalid && "border-red-500 focus-visible:ring-red-500")}
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