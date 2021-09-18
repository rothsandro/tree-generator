export interface Item {
  name: string;
  indent: number;
}

export interface ItemWithHierarchy extends Item {
  level: number;
  hasChildren: boolean;
}

export interface ItemWithAscii extends ItemWithHierarchy {
  ascii: Ascii[];
}

export enum Ascii {
  CHILD = "CHILD",
  LAST_CHILD = "LAST_CHILD",
  INDENT = "INDENT",
  PATH = "PATH",
}
