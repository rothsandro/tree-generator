import { Item, ItemWithHierarchy } from "../types/item.types";

const NEW_LINE_SEPARATOR_REGEX = /\r?\n/;

export function parseInput(input: string): ItemWithHierarchy[] {
  const items = input
    .split(NEW_LINE_SEPARATOR_REGEX)
    .filter((line) => line.trim().length > 0)
    .map((line) => parseLine(line));

  return calculateLevel(items);
}

export function calculateLevel(items: Item[]): ItemWithHierarchy[] {
  const itemsWithLevelInReverseOrder: ItemWithHierarchy[] = [];

  for (let item of items) {
    const parentItem = itemsWithLevelInReverseOrder.find(
      (itemWithLevel) => itemWithLevel.indent < item.indent
    );

    const level = parentItem ? parentItem.level + 1 : 0;
    itemsWithLevelInReverseOrder.unshift({
      ...item,
      level,
      hasChildren: false,
    });
  }

  const itemsWithLevel = itemsWithLevelInReverseOrder.reverse();
  itemsWithLevel.forEach((item, idx, list) => {
    const nextItem = list[idx + 1];
    item.hasChildren = !!(nextItem?.level > item.level);
  });

  return itemsWithLevel;
}

export function parseLine(line: string): Item {
  const name = line.trim();
  const indent = line.length - line.trimStart().length;
  const item: Item = { name, indent };
  return item;
}
