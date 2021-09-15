import { Item } from "../types/item.types";

const NEW_LINE_SEPARATOR = "\n";
const LEVEL_INDENT = "  ";
const FOLDER_SUFFIX = "/";

export function convertItemsToText(items: Item[]): string {
  return items
    .map((item) => {
      const indent = LEVEL_INDENT.repeat(item.level);
      const suffix = item.hasChildren ? FOLDER_SUFFIX : "";
      return indent + item.name + (item.name.endsWith(suffix) ? "" : suffix);
    })
    .join(NEW_LINE_SEPARATOR);
}
