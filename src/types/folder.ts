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


  counts?: any; // used to display the count items in folder card, that shows the nested items in that specific folder

}

export interface FolderData {
  folders: IFolderClient[];
  bookmarks: IBookmarkClient[];
}
