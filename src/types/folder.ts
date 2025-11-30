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


  stats?: any; // used to display the count items in folder card, that shows the nested items in that specific folder

}

export interface FolderData {
  folders: IFolderClient[];
  bookmarks: IBookmarkClient[];
}


// The basic folder object found inside lists
export interface ISubFolderClient {
  _id: string;
  name: string;
  description?: string;
  subFolders?: IFolderClient[] | []; // Lowercase in your aggregation result
  bookmarks?: IBookmarkClient[];
  stats?: {
    subFolders: number;
    bookmarks: number;
    totalItems: number;
  };
  updatedAt?: string | Date;
  createdAt?: string | Date;
}

export interface IFolderTreeClient {
  _id: string;
  name: string;
  children?: IFolderTreeClient[]; // The recursive part
  parentFolder?: string; // ID of parent
  subFolders?: any[]; // Kept for compatibility if API returns it
}