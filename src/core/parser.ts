import { Item, ItemType } from "../types/item.types";

const NEW_LINE_SEPARATOR_REGEX = /\r?\n/;
const FOLDER_SUFFIX = "/";

export function parseInput(input: string): Item[] {
  const items = input
    .split(NEW_LINE_SEPARATOR_REGEX)
    .filter((line) => line.trim().length > 0)
    .map((line) => parseLine(line));

  const itemsWithLevel = calculateLevel(items);
  return itemsWithLevel;
}

export function calculateLevel(items: Item[]): Item[] {
  const itemsWithLevel: Item[] = [];

  for (let item of items) {
    const parentFolder = itemsWithLevel.find(
      (itemWithLevel) =>
        itemWithLevel.type === ItemType.FOLDER &&
        itemWithLevel.indent < item.indent
    );

    const level = parentFolder ? parentFolder.level + 1 : 0;
    itemsWithLevel.unshift({ ...item, level });
  }

  return itemsWithLevel.reverse();
}

export function parseLine(line: string): Item {
  const name = line.trim();
  const isFolder = name.endsWith(FOLDER_SUFFIX);
  const indent = line.length - line.trimStart().length;
  let item: Item;

  if (isFolder) {
    item = {
      type: ItemType.FOLDER,
      name,
      plainName: name.slice(0, -1),
      indent,
    };
  } else {
    item = {
      type: ItemType.FILE,
      name,
      indent,
    };
  }

  return item;
}
