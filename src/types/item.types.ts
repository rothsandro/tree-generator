export enum ItemType {
  FOLDER = "FOLDER",
  FILE = "FILE",
}

export type Item = FolderItem | FileItem;

export interface ItemBase {
  level?: number;
  indent: number;
}

export interface FolderItem extends ItemBase {
  type: ItemType.FOLDER;
  name: string;
  plainName: string;
}

export interface FileItem extends ItemBase {
  type: ItemType.FILE;
  name: string;
}
