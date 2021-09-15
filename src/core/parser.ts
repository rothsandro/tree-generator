import { Item, ItemType } from "../types/item.types";

const NEW_LINE_SEPARATOR_REGEX = /\r?\n/;
const FOLDER_SUFFIX = "/";

export function parseInput(input: string) {
  const output = input
    .split(NEW_LINE_SEPARATOR_REGEX)
    .filter((line) => line.trim().length > 0)
    .map((line) => parseLine(line));
  return output;
}

export function parseLine(line: string): Item {
  const name = line.trim();
  const isFolder = name.endsWith(FOLDER_SUFFIX);
  let item: Item;

  if (isFolder) {
    item = {
      type: ItemType.FOLDER,
      name,
      plainName: name.slice(0, -1),
    };
  } else {
    item = {
      type: ItemType.FILE,
      name,
    };
  }

  return item;
}