import { ItemWithHierarchy } from "../types/item.types";
import { convertItemsToText } from "./output";
import dedent from "dedent";

describe("output:basics", () => {
  it("outputs a file name", () => {
    const input: ItemWithHierarchy[] = [
      { name: "file.txt", level: 0, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = "file.txt";
    expect(output).toBe(expected);
  });

  it("outputs a folder with files", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "file1.txt", level: 1, indent: 0, hasChildren: false },
      { name: "file2.txt", level: 1, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      ├── file1.txt
      └── file2.txt
    `);
    expect(output).toBe(expected);
  });

  it("does not add a slash to a folder if is already present", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src/", level: 0, indent: 0, hasChildren: true },
      { name: "file.txt", level: 1, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      └── file.txt
    `);
    expect(output).toBe(expected);
  });
});

describe("output:nesting", () => {
  it("outputs nested folders", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "file.txt", level: 2, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      └── one/
          └── file.txt
    `);

    expect(output).toBe(expected);
  });

  it("outputs nested folders with siblings", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "file1.txt", level: 2, indent: 0, hasChildren: false },
      { name: "two", level: 1, indent: 0, hasChildren: true },
      { name: "file2.txt", level: 2, indent: 0, hasChildren: false },
      { name: "file3.txt", level: 2, indent: 0, hasChildren: false },
      { name: "three", level: 1, indent: 0, hasChildren: true },
      { name: "file4.txt", level: 2, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      ├── one/
      │   └── file1.txt
      ├── two/
      │   ├── file2.txt
      │   └── file3.txt
      └── three/
          └── file4.txt
    `);

    expect(output).toBe(expected);
  });

  it("outputs deeply nested folders with siblings", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "one-a", level: 2, indent: 0, hasChildren: true },
      { name: "file1.txt", level: 3, indent: 0, hasChildren: false },
      { name: "file2.txt", level: 3, indent: 0, hasChildren: false },
      { name: "one-b", level: 2, indent: 0, hasChildren: true },
      { name: "file3.txt", level: 3, indent: 0, hasChildren: false },
      { name: "two", level: 1, indent: 0, hasChildren: true },
      { name: "file4.txt", level: 2, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      ├── one/
      │   ├── one-a/
      │   │   ├── file1.txt
      │   │   └── file2.txt
      │   └── one-b/
      │       └── file3.txt
      └── two/
          └── file4.txt
    `);

    expect(output).toBe(expected);
  });

  it("outputs nested folders with multiple folders on root", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "two", level: 2, indent: 0, hasChildren: false },
      { name: "public", level: 0, indent: 0, hasChildren: true },
      { name: "assets", level: 1, indent: 0, hasChildren: true },
      { name: "img.png", level: 2, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input);
    const expected = dedent(`
      src/
      └── one/
          └── two
      public/
      └── assets/
          └── img.png
    `);

    expect(output).toBe(expected);
  });
});

describe("output:root", () => {
  it("adds a root element if enabled", () => {
    const input: ItemWithHierarchy[] = [
      { name: "src", level: 0, indent: 0, hasChildren: true },
      { name: "one", level: 1, indent: 0, hasChildren: true },
      { name: "file.txt", level: 2, indent: 0, hasChildren: false },
      { name: ".gitignore", level: 0, indent: 0, hasChildren: false },
    ];
    const output = convertItemsToText(input, { rootElement: true });
    const expected = dedent(`
      .
      ├── src/
      │   └── one/
      │       └── file.txt
      └── .gitignore
    `);

    expect(output).toBe(expected);
  });
});
