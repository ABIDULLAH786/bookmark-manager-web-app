export interface IBookmarkClient {
  _id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  createdBy?: string; // make it required once the actuall data is used
  parentFolder?: string;
  sharedWith?: string[];
  isFavoriteBy?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  folderId?: string; // TODO: remove this once the relation is added and actual data is used
}
