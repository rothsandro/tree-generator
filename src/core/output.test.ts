import { Item, ItemType } from "../types/item.types";
import { convertItemsToText } from "./output";
import dedent from "dedent";

describe("output", () => {
  it("outputs a file name", () => {
    const input: Item[] = [
      { type: ItemType.FILE, name: "file.txt", level: 0, indent: 0 },
    ];
    const output = convertItemsToText(input);
    const expected = "file.txt";
    expect(output).toBe(expected);
  });

  it("outputs a folder name", () => {
    const input: Item[] = [
      {
        type: ItemType.FOLDER,
        name: "src/",
        plainName: "src",
        level: 0,
        indent: 0,
      },
    ];
    const output = convertItemsToText(input);
    const expected = "src/";
    expect(output).toBe(expected);
  });

  it("outputs files and folders", () => {
    const input: Item[] = [
      {
        type: ItemType.FOLDER,
        name: "src/",
        plainName: "src",
        level: 0,
        indent: 0,
      },
      { type: ItemType.FILE, name: "file1.txt", level: 0, indent: 0 },
      { type: ItemType.FILE, name: "file2.txt", level: 0, indent: 0 },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      file1.txt
      file2.txt
    `);
    expect(output).toBe(expected);
  });

  it("outputs nested items", () => {
    const input: Item[] = [
      {
        type: ItemType.FOLDER,
        name: "src/",
        plainName: "src",
        level: 0,
        indent: 0,
      },
      {
        type: ItemType.FOLDER,
        name: "one/",
        plainName: "one",
        level: 1,
        indent: 0,
      },
      { type: ItemType.FILE, name: "file.txt", level: 2, indent: 0 },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
        one/
          file.txt
    `);

    expect(output).toBe(expected);
  });
});
