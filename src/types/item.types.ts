export interface Item {
  name: string;
  indent: number;
  level?: number;
  hasChildren?: boolean;
}

export interface ItemWithAscii extends Item {
  ascii: Ascii[];
}

export enum Ascii {
  CHILD = "CHILD",
  LAST_CHILD = "LAST_CHILD",
  INDENT = "INDENT",
  PATH = "PATH",
}
