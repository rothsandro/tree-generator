export enum ItemType {
  FOLDER = "FOLDER",
  FILE = "FILE",
}

export type Item = FolderItem | FileItem;

export interface FolderItem {
  type: ItemType.FOLDER;
  name: string;
  plainName: string;
}

export interface FileItem {
  type: ItemType.FILE;
  name: string;
}
