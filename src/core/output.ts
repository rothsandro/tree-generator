import { Item } from "../types/item.types";

const NEW_LINE_SEPARATOR = "\n";

export function convertItemsToText(items: Item[]): string {
  return items.map((item) => item.name).join(NEW_LINE_SEPARATOR);
}
