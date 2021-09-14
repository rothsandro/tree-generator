import { Item, ItemType } from "../types/item.types";
import { convertItemsToText } from "./output";

describe("output", () => {
  it("outputs a file name", () => {
    const input: Item[] = [{ type: ItemType.FILE, name: "file.txt" }];
    const output = convertItemsToText(input);
    const expected = "file.txt";
    expect(output).toBe(expected);
  });

  it("outputs a folder name", () => {
    const input: Item[] = [
      { type: ItemType.FOLDER, name: "src/", plainName: "src" },
    ];
    const output = convertItemsToText(input);
    const expected = "src/";
    expect(output).toBe(expected);
  });

  it("outputs files and folders", () => {
    const input: Item[] = [
      { type: ItemType.FOLDER, name: "src/", plainName: "src" },
      { type: ItemType.FILE, name: "file1.txt" },
      { type: ItemType.FILE, name: "file2.txt" },
    ];
    const output = convertItemsToText(input);
    const expected = "src/\nfile1.txt\nfile2.txt";
    expect(output).toBe(expected);
  });
});
