import { Item, ItemType } from "../types/item.types";
import { parseInput } from "./parser";

describe("parser", () => {
  it("parses a file", () => {
    const input = "file.txt";
    const output = parseInput(input);
    const expected: Item[] = [{ type: ItemType.FILE, name: "file.txt" }];
    expect(output).toEqual(expected);
  });

  it("parses a folder", () => {
    const input = "src/";
    const output = parseInput(input);
    const expected: Item[] = [
      { type: ItemType.FOLDER, name: "src/", plainName: "src" },
    ];
    expect(output).toEqual(expected);
  });

  it("parses multiple lines", () => {
    const input = "src/\nfile1.txt\r\nfile2.txt";
    const output = parseInput(input);
    const expected: Item[] = [
      { type: ItemType.FOLDER, name: "src/", plainName: "src" },
      { type: ItemType.FILE, name: "file1.txt" },
      { type: ItemType.FILE, name: "file2.txt" },
    ];
    expect(output).toEqual(expected);
  });

  it("ignores leading and trailing white spaces for a file", () => {
    const input = "   file.txt    ";
    const output = parseInput(input);
    const expected: Item[] = [{ type: ItemType.FILE, name: "file.txt" }];
    expect(output).toEqual(expected);
  });

  it("ignores leading and trailing white spaces for a folder", () => {
    const input = "   src/    ";
    const output = parseInput(input);
    const expected: Item[] = [
      { type: ItemType.FOLDER, name: "src/", plainName: "src" },
    ];
    expect(output).toEqual(expected);
  });
});
