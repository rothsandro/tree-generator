import { TreeConfig } from "../types/config.types";
import { Ascii, ItemWithAscii, ItemWithHierarchy } from "../types/item.types";
import { noop, pipe } from "../utils/pipe";

const NEW_LINE_SEPARATOR = "\n";
const FOLDER_SUFFIX = "/";
const ASCII_MAPPING: Record<Ascii, string> = {
  [Ascii.CHILD]: "├── ",
  [Ascii.LAST_CHILD]: "└── ",
  [Ascii.INDENT]: "    ",
  [Ascii.PATH]: "│   ",
};

export function convertItemsToText(
  items: ItemWithHierarchy[],
  config: TreeConfig = {}
): string {
  const finalItems = pipe(
    items,
    addSuffix,
    config.rootElement ? addRootElement : noop,
    addAsciiCodes,
    addAsciiStringsToName,
    (value) => addComment(value, config.alignComments)
  );

  return finalItems.map((item) => item.name).join(NEW_LINE_SEPARATOR);
}

function addRootElement(items: ItemWithHierarchy[]) {
  if (items.length === 0) return items;

  const root: ItemWithHierarchy = {
    name: ".",
    indent: 0,
    level: 0,
    hasChildren: true,
  };
  const children = items.map((item) => ({ ...item, level: item.level + 1 }));
  return [root, ...children];
}

function addAsciiStringsToName(items: ItemWithAscii[]): ItemWithAscii[] {
  return items.map((item) => ({
    ...item,
    name: `${getAsciiString(item)}${item.name}`,
  }));
}

function getAsciiString(item: ItemWithAscii): string {
  return item.ascii.map((ascii) => ASCII_MAPPING[ascii]).join("");
}

function addSuffix(items: ItemWithHierarchy[]): ItemWithHierarchy[] {
  return items.map((item) => {
    if (!item.hasChildren) return item;
    if (item.name.endsWith(FOLDER_SUFFIX)) return item;
    return { ...item, name: `${item.name}${FOLDER_SUFFIX}` };
  });
}

function addComment(
  items: ItemWithHierarchy[],
  align: boolean
): ItemWithHierarchy[] {
  const maxLength = align
    ? Math.max(...items.map((item) => item.name.length))
    : 0;

  return items.map((item) => {
    if (!item.comment) return item;
    const name = item.name.padEnd(maxLength, " ");
    const nameWithComment = `${name}  # ${item.comment}`;
    return { ...item, name: nameWithComment };
  });
}

function addAsciiCodes(items: ItemWithHierarchy[]): ItemWithAscii[] {
  const result: ItemWithAscii[] = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const levelsUpToCurrent = Math.max(item.level - 1, 0);

    const ascii: Ascii[] = [...Array(levelsUpToCurrent).fill(Ascii.INDENT)];

    if (item.level > 0) {
      const hasSubsequentChildren = findSiblings(items, idx);
      ascii.push(hasSubsequentChildren ? Ascii.CHILD : Ascii.LAST_CHILD);
    }

    for (let level of findSubsequentLevels(items, idx)) {
      ascii[level - 1] = Ascii.PATH;
    }

    result.push({ ...item, ascii });
  }

  return result;
}

function findSiblings(items: ItemWithHierarchy[], itemIdx: number): boolean {
  const mainLevel = items[itemIdx].level;
  for (let idx = itemIdx + 1; idx < items.length; idx++) {
    const level = items[idx].level;
    if (level === mainLevel) return true;
    if (level < mainLevel) return false;
  }

  return false;
}

function findSubsequentLevels(
  items: ItemWithHierarchy[],
  itemIdx: number
): number[] {
  const minLevel = 1;
  let maxLevel = items[itemIdx].level - 1;
  const levels = new Set<number>();

  for (let idx = itemIdx + 1; idx < items.length; idx++) {
    if (items[idx].level >= minLevel && items[idx].level <= maxLevel) {
      levels.add(items[idx].level);
      maxLevel = items[idx].level;
    } else if (items[idx].level < minLevel) {
      // Level is below the min level,
      // subsequent children in the defined level range are not relevant anymore
      break;
    }
  }

  return Array.from(levels);
}
