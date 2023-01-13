import { Range } from "../types/range.types";

const lineBreak = "\n";

export class Editor {
  private lines: Line[];

  get selectedLines() {
    return this.lines.filter((line) => line.isSelected);
  }

  get selection() {
    return new Selection(this.getSelectionStart(), this.getSelectionEnd());
  }

  get hasTextSelected() {
    return this.lines.some((line) => line.hasTextSelected);
  }

  constructor(value: string, selection: Selection) {
    const textLines = value.match(/^.*(?:\r?\n|$)/gm);
    this.lines = textLines.map((line, index, list) => {
      const startPos = list.slice(0, index).join("").length;
      return Line.fromRelativeSelection(line, selection.moveBy(-startPos));
    });
  }

  insertLineAfter(newLine: Line, after: Line) {
    const lineIdx = this.lines.indexOf(after);
    this.lines.splice(lineIdx + 1, 0, newLine);
  }

  removeSelection() {
    this.lines.forEach((line) => line.removeSelection());
  }

  private getSelectionStart() {
    const lineIdx = this.lines.findIndex((line) => line.isSelected);
    const line = this.lines[lineIdx];
    return (
      this.lines.slice(0, lineIdx).join(lineBreak).length +
      (lineIdx > 0 ? lineBreak.length : 0) +
      line.selection.start
    );
  }

  private getSelectionEnd() {
    const lineIdx = this.lines.findIndex(
      (line, idx, list) => line.isSelected && !list[idx + 1]?.isSelected
    );
    const line = this.lines[lineIdx];
    return (
      this.lines.slice(0, lineIdx).join(lineBreak).length +
      (lineIdx > 0 ? lineBreak.length : 0) +
      line.selection.end
    );
  }

  toString() {
    return this.lines.join(lineBreak);
  }
}

export class Line {
  constructor(private value: string, private _selection: Selection) {}

  static fromRelativeSelection(text: string, relativeSelection: Selection) {
    const { content } = extractLineBreak(text);
    const lineSelection = getLineSelection(content, relativeSelection);
    return new Line(content, lineSelection);
  }

  static fromText(text: string) {
    return new Line(text, new Selection(text.length, text.length));
  }

  get selection() {
    return this._selection;
  }

  get isSelected() {
    return this.selection.isValid;
  }

  get hasTextSelected() {
    return this.selection.length > 0;
  }

  get isCursorAtEnd() {
    return (
      this.selection.start === this.value.length &&
      this.selection.end === this.value.length
    );
  }

  indent() {
    const indent = "  ";
    this.value = indent + this.value;

    if (this.selection.isValid) {
      this._selection = this.selection.moveBy(indent.length);
    }
  }

  outdent() {
    const newValue = this.value.replace(/^( {1,2})/, "");
    const diff = this.value.length - newValue.length;
    this.value = newValue;

    if (this.selection.isValid) {
      this._selection = new Selection(
        Math.max(0, this.selection.start - diff),
        Math.max(0, this.selection.end - diff)
      );
    }
  }

  insertTextBeforeSelection(text: string) {
    if (!this.selection.isValid) throw new Error("Line has no selection");

    const before = this.value.substring(0, this.selection.start);
    const after = this.value.substring(this.selection.end);
    this.value = before + text + after;
    this._selection = this.selection.moveBy(text.length);
  }

  getIndentation() {
    const match = this.value.match(/^( *)/);
    return match ? match[0] : "";
  }

  removeSelection() {
    this._selection = new Selection();
  }

  setSelectionToEnd() {
    this._selection = new Selection(this.value.length, this.value.length);
  }

  toString() {
    return this.value;
  }
}

export class Selection extends Range {
  constructor(start: number = -1, end: number = -1) {
    super(start, end);
  }

  get isValid() {
    return this.start !== -1 && this.end !== -1;
  }

  get length() {
    return this.end - this.start;
  }

  moveBy(diff: number) {
    return new Selection(this.start + diff, this.end + diff);
  }
}

function getLineSelection(line: string, selection: Selection) {
  const isSelectionBefore = selection.end < 0;
  const isSelectionAfter = selection.start > line.length;
  if (isSelectionBefore || isSelectionAfter) return new Selection();

  const start = Math.max(0, selection.start);
  const end = Math.min(selection.end, line.length);

  return new Selection(start, end);
}

function extractLineBreak(text: string) {
  const [content, lineBreak = ""] = text.split(/(\r?\n)$/);
  return { content, lineBreak };
}
