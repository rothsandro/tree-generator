import { parseInput } from "./parser";
import dedent from "dedent";

function buildInput(...lines: string[]): string {
  return lines.join("\n");
}

describe("parser basics", () => {
  it("parses a file", () => {
    const input = "file.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt" });
  });

  it("parses a folder with a file", () => {
    const input = dedent(`
      src
        file.txt
    `);
    const output = parseInput(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ name: "src", hasChildren: true });
    expect(output[1]).toMatchObject({ name: "file.txt", hasChildren: false });
  });

  it("parses multiple lines", () => {
    const input = dedent(`
      file1.txt
      file2.txt
      file3.txt
    `);
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({ name: "file1.txt", hasChildren: false });
    expect(output[1]).toMatchObject({ name: "file2.txt", hasChildren: false });
    expect(output[2]).toMatchObject({ name: "file3.txt", hasChildren: false });
  });

  it("ignores leading and trailing white spaces for a file name", () => {
    const input = "   file.txt    ";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt", hasChildren: false });
  });

  it("ignores leading and trailing white spaces for a folder name", () => {
    const input = "   src    \n         file.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ name: "src", hasChildren: true });
    expect(output[1]).toMatchObject({ name: "file.txt", hasChildren: false });
  });

  it("ignores leading and trailing tabs for a file name", () => {
    const input = "\tfile.txt\t\t";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt", hasChildren: false });
  });

  it("ignores leading and trailing tabs for a folder name", () => {
    const input = "\tsrc\t\t\n  file.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ name: "src", hasChildren: true });
    expect(output[1]).toMatchObject({ name: "file.txt", hasChildren: false });
  });

  it("ignores empty lines between items", () => {
    const input = "\nfile1.txt\n  \t\t\t   \nfile2.txt\n  ";
    const output = parseInput(input);

    expect(output).toHaveLength(2);
    expect(output[0]).toMatchObject({ name: "file1.txt", hasChildren: false });
    expect(output[1]).toMatchObject({ name: "file2.txt", hasChildren: false });
  });

  it("ignores an input with white spaces/tabs and no text", () => {
    const input = "  \t\t\t   ";
    const output = parseInput(input);

    expect(output).toHaveLength(0);
  });
});

describe("parser comments", () => {
  it("has comment as undefined by default", () => {
    const input = "file.txt";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ name: "file.txt", comment: undefined });
  });

  it("parses a comment", () => {
    const input = "file.txt # this is a comment";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({
      name: "file.txt",
      comment: "this is a comment",
    });
  });

  it("parses a comment that contains #", () => {
    const input = "file.txt # one # two ## three ###";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({
      name: "file.txt",
      comment: "one # two ## three ###",
    });
  });
});

describe("parser tree", () => {
  it("ignores indents on root level", () => {
    const input = "   src";
    const output = parseInput(input);

    expect(output).toHaveLength(1);
    expect(output[0]).toMatchObject({ level: 0 });
  });

  it("parses the level for properly nested children", () => {
    const input = buildInput(
      "src", // level 0
      "  file1.txt", // level 1
      "  file2.txt" // level 2
    );
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "file1.txt",
      level: 1,
      hasChildren: false,
    });
    expect(output[2]).toMatchObject({
      name: "file2.txt",
      level: 1,
      hasChildren: false,
    });
  });

  it("parses the level for children with different nesting", () => {
    const input = buildInput(
      "src", // level 0
      "    file1.txt", // level 1
      "  file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(3);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "file1.txt",
      level: 1,
      hasChildren: false,
    });
    expect(output[2]).toMatchObject({
      name: "file2.txt",
      level: 1,
      hasChildren: false,
    });
  });

  it("parses the level for nested children", () => {
    const input = buildInput(
      "src", // level 0
      "   one", // level 1
      "     two", // level 2
      "      file.txt" // level 3
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "one",
      level: 1,
      hasChildren: true,
    });
    expect(output[2]).toMatchObject({
      name: "two",
      level: 2,
      hasChildren: true,
    });
    expect(output[3]).toMatchObject({
      name: "file.txt",
      level: 3,
      hasChildren: false,
    });
  });

  it("parses the level for nested children and siblings", () => {
    const input = buildInput(
      "src", // level 0
      "   one", // level 1
      "     file1.txt", // level 2
      "   file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "one",
      level: 1,
      hasChildren: true,
    });
    expect(output[2]).toMatchObject({
      name: "file1.txt",
      level: 2,
      hasChildren: false,
    });
    expect(output[3]).toMatchObject({
      name: "file2.txt",
      level: 1,
      hasChildren: false,
    });
  });

  it("parses the level for nested children and siblings with different indents", () => {
    const input = buildInput(
      "src", // level 0
      "   one", // level 1
      "     file1.txt", // level 2
      " file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "one",
      level: 1,
      hasChildren: true,
    });
    expect(output[2]).toMatchObject({
      name: "file1.txt",
      level: 2,
      hasChildren: false,
    });
    expect(output[3]).toMatchObject({
      name: "file2.txt",
      level: 1,
      hasChildren: false,
    });
  });

  it("parses the level with siblings on root", () => {
    const input = buildInput(
      "src", // level 0
      "  file1.txt", // level 1
      "two", // level 0
      "    file2.txt" // level 1
    );
    const output = parseInput(input);

    expect(output).toHaveLength(4);
    expect(output[0]).toMatchObject({
      name: "src",
      level: 0,
      hasChildren: true,
    });
    expect(output[1]).toMatchObject({
      name: "file1.txt",
      level: 1,
      hasChildren: false,
    });
    expect(output[2]).toMatchObject({
      name: "two",
      level: 0,
      hasChildren: true,
    });
    expect(output[3]).toMatchObject({
      name: "file2.txt",
      level: 1,
      hasChildren: false,
    });
  });

  it("parses nested folders", () => {
    const input = buildInput(
      "src", // level 0
      "  one", // level 1
      "      two", // level 2
      "    three", // level 2
      "        four", // level 3
      " five", // level 1
      "six" // level 0
    );
    const output = parseInput(input);

    expect(output).toHaveLength(7);
    expect(output[0]).toMatchObject({ name: "src", level: 0 });
    expect(output[1]).toMatchObject({ name: "one", level: 1 });
    expect(output[2]).toMatchObject({ name: "two", level: 2 });
    expect(output[3]).toMatchObject({ name: "three", level: 2 });
    expect(output[4]).toMatchObject({ name: "four", level: 3 });
    expect(output[5]).toMatchObject({ name: "five", level: 1 });
    expect(output[6]).toMatchObject({ name: "six", level: 0 });
  });
});
