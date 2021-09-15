import { ItemType } from "../types/item.types";
import { parseInput } from "./parser";

function buildInput(...lines: string[]): string {
  return lines.join("\n");
}

describe("parser", () => {
  it("parses a file", () => {
    const input = "file.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ type: ItemType.FILE, name: "file.txt" });
  });

  it("parses a folder", () => {
    const input = "src/";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({
      type: ItemType.FOLDER,
      name: "src/",
      plainName: "src",
    });
  });

  it("parses multiple lines", () => {
    const input = "src/\nfile1.txt\r\nfile2.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({
      type: ItemType.FOLDER,
      name: "src/",
      plainName: "src",
    });
    expect(output[1]).toMatchObject({ type: ItemType.FILE, name: "file1.txt" });
    expect(output[2]).toMatchObject({ type: ItemType.FILE, name: "file2.txt" });
  });

  it("ignores leading and trailing white spaces for a file name", () => {
    const input = "   file.txt    ";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt" });
  });

  it("ignores leading and trailing white spaces for a folder name", () => {
    const input = "   src/    ";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "src/", plainName: "src" });
  });

  it("ignores leading and trailing tabs for a file name", () => {
    const input = "\tfile.txt\t\t";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt" });
  });

  it("ignores leading and trailing tabs for a folder name", () => {
    const input = "\tsrc/\t\t";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({
      type: ItemType.FOLDER,
      name: "src/",
      plainName: "src",
    });
  });

  it("ignores empty lines between items", () => {
    const input = "\nsrc/\n  \t\t\t   \nfile.txt\n  ";
    const output = parseInput(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({
      type: ItemType.FOLDER,
      name: "src/",
      plainName: "src",
    });
    expect(output[1]).toMatchObject({ type: ItemType.FILE, name: "file.txt" });
  });

  it("ignores an input with white spaces/tabs and no text", () => {
    const input = "  \t\t\t   ";
    const output = parseInput(input);

    expect(output).toHaveLength(0);
  });

  it("ignores indents on root level", () => {
    const input = "   src/";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ level: 0 });
  });

  it("parses the level for properly nested children", () => {
    const input = buildInput(
      "src/", // level 0
      "  file1.txt", // level 1
      "  file2.txt" // level 2
    );
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "file1.txt", level: 1 });
    expect(output[2]).toMatchObject({ name: "file2.txt", level: 1 });
  });

  it("parses the level for children with different nesting", () => {
    const input = buildInput(
      "src/", // level 0
      "   file1.txt", // level 1
      "  file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "file1.txt", level: 1 });
    expect(output[2]).toMatchObject({ name: "file2.txt", level: 1 });
  });

  it("parses the level for nested children", () => {
    const input = buildInput(
      "src/", // level 0
      "   one/", // level 1
      "     two/", // level 2
      "      file.txt" // level 3
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "one/", level: 1 });
    expect(output[2]).toMatchObject({ name: "two/", level: 2 });
    expect(output[3]).toMatchObject({ name: "file.txt", level: 3 });
  });

  it("parses the level for nested children and siblings", () => {
    const input = buildInput(
      "src/", // level 0
      "   one/", // level 1
      "     file1.txt", // level 2
      "   file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "one/", level: 1 });
    expect(output[2]).toMatchObject({ name: "file1.txt", level: 2 });
    expect(output[3]).toMatchObject({ name: "file2.txt", level: 1 });
  });

  it("parses the level for nested children and siblings with different indents", () => {
    const input = buildInput(
      "src/", // level 0
      "   one/", // level 1
      "     file1.txt", // level 2
      " file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "one/", level: 1 });
    expect(output[2]).toMatchObject({ name: "file1.txt", level: 2 });
    expect(output[3]).toMatchObject({ name: "file2.txt", level: 1 });
  });

  it("parses the level with siblings on root", () => {
    const input = buildInput(
      "src/", // level 0
      "  one/", // level 1
      "two/", // level 0
      "    file.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "one/", level: 1 });
    expect(output[2]).toMatchObject({ name: "two/", level: 0 });
    expect(output[3]).toMatchObject({ name: "file.txt", level: 1 });
  });

  it("does not nest files in files", () => {
    const input = buildInput(
      "src/", // level 0
      "  file1.txt", // level 1
      "    file2.txt" // level 1 because it's a file
    );
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "file1.txt", level: 1 });
    expect(output[2]).toMatchObject({ name: "file2.txt", level: 1 });
  });

  it("parses nested folders", () => {
    const input = buildInput(
      "src/", // level 0
      "  one/", // level 1
      "      two/", // level 2
      "    three/", // level 2
      "        four/", // level 3
      " five/", // level 1
      "six/" // level 0
    );
    const output = parseInput(input);

    expect(output).toHaveLength(7);
    expect(output[0]).toMatchObject({ name: "src/", level: 0 });
    expect(output[1]).toMatchObject({ name: "one/", level: 1 });
    expect(output[2]).toMatchObject({ name: "two/", level: 2 });
    expect(output[3]).toMatchObject({ name: "three/", level: 2 });
    expect(output[4]).toMatchObject({ name: "four/", level: 3 });
    expect(output[5]).toMatchObject({ name: "five/", level: 1 });
    expect(output[6]).toMatchObject({ name: "six/", level: 0 });
  });
});
