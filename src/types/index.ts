export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  folderId?: string;
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
}

export interface BookmarkData {
  folders: Folder[];
  bookmarks: Bookmark[];
}