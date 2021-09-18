import { Ascii, ItemWithAscii, ItemWithHierarchy } from "../types/item.types";

const NEW_LINE_SEPARATOR = "\n";
const FOLDER_SUFFIX = "/";
const ASCII_MAPPING: Record<Ascii, string> = {
  [Ascii.CHILD]: "├──",
  [Ascii.LAST_CHILD]: "└──",
  [Ascii.INDENT]: "   ",
  [Ascii.PATH]: "│  ",
};

export function convertItemsToText(items: ItemWithHierarchy[]): string {
  return addAsciiCodes(items)
    .map((item) => {
      const suffix = item.hasChildren ? FOLDER_SUFFIX : "";
      const asciiCodes = item.ascii
        .map((ascii) => ASCII_MAPPING[ascii])
        .join("");
      return (
        asciiCodes + item.name + (item.name.endsWith(suffix) ? "" : suffix)
      );
    })
    .join(NEW_LINE_SEPARATOR);
}

export function addAsciiCodes(items: ItemWithHierarchy[]): ItemWithAscii[] {
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
