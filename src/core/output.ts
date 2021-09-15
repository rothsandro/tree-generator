import { Item } from "../types/item.types";

const NEW_LINE_SEPARATOR = "\n";
const LEVEL_INDENT = "  ";

export function convertItemsToText(items: Item[]): string {
  return items
    .map((item) => {
      const indent = LEVEL_INDENT.repeat(item.level);
      return indent + item.name;
    })
    .join(NEW_LINE_SEPARATOR);
}
