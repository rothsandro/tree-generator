import { Item, ItemWithHierarchy } from "../types/item.types";

const NEW_LINE_SEPARATOR_REGEX = /\r?\n/;
const COMMENT_START = " # ";
const COMMENT_LINE = /^\s*#\s.*/;

export function parseInput(input: string): ItemWithHierarchy[] {
  const items = input
    .split(NEW_LINE_SEPARATOR_REGEX)
    .filter((line) => line.trim().length > 0)
    .filter((line) => !COMMENT_LINE.test(line))
    .map((line) => parseLine(line));
  return calculateLevel(items);
}

function calculateLevel(items: Item[]): ItemWithHierarchy[] {
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

function parseLine(line: string): Item {
  const content = line.trim();
  let name = content.trim();
  let comment = undefined;

  if (name.includes(COMMENT_START)) {
    name = content.substring(0, content.indexOf(COMMENT_START)).trim();
    comment = content
      .substring(content.indexOf(COMMENT_START) + COMMENT_START.length)
      .trim();
  }

  const indent = line.length - line.trimStart().length;
  const item: Item = { name: name.trim(), indent, comment };

  return item;
}
