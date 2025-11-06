import { IBookmarkClient } from "./bookmark";

export interface IFolderClient {
  _id?: string; 
  name: string;
  description?: string;
  icon?: string;
  createdBy?: string; //TODO: make this required instead of optional on actual data

  parentFolder?: string;
  subFolders?: string[];
  bookmarks?: string[];

  sharedWith?: string[];
  isFavoriteBy?: string[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FolderData {
  folders: IFolderClient[];
  bookmarks: IBookmarkClient[];
}
