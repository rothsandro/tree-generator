import { Item } from "../types/item.types";
import { convertItemsToText } from "./output";
import dedent from "dedent";

describe("output", () => {
  it("outputs a file name", () => {
    const input: Item[] = [
      { name: "file.txt", level: 0, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = "file.txt";
    expect(output).toBe(expected);
  });

  it("outputs a folder with files", () => {
    const input: Item[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "file1.txt", level: 1, indent: 0, hasChildren: false },
      { name: "file2.txt", level: 1, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
        file1.txt
        file2.txt
    `);
    expect(output).toBe(expected);
  });

  it("does not add a slash to a folder if is already present", () => {
    const input: Item[] = [
      { name: "src/", level: 0, indent: 0, hasChildren: true },
      { name: "file.txt", level: 1, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
        file.txt
    `);
    expect(output).toBe(expected);
  });

  it("outputs nested folders", () => {
    const input: Item[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "file.txt", level: 2, indent: 0, hasChildren: false },
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
