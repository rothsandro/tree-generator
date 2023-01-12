import { Range } from "../types/range.types";

export class Editor {
  private lines: Line[];

  get selectedLines() {
    return this.lines.filter((line) => line.isSelected);
  }

  get selection() {
    return new Selection(this.getSelectionStart(), this.getSelectionEnd());
  }

  constructor(value: string, selection: Selection) {
    const textLines = value.match(/^.*(?:\r?\n|$)/gm);
    this.lines = textLines.map((line, index, list) => {
      const startPos = list.slice(0, index).join("").length;
      const relativeSelection = selection.moveBy(-startPos);
      return new Line(line, getLineSelection(line, relativeSelection));
    });
  }

  private getSelectionStart() {
    const lineIdx = this.lines.findIndex((line) => line.isSelected);
    const line = this.lines[lineIdx];
    return this.lines.slice(0, lineIdx).join("").length + line.selection.start;
  }

  private getSelectionEnd() {
    const lineIdx = this.lines.findIndex(
      (line, idx, list) => line.isSelected && !list[idx + 1]?.isSelected
    );
    const line = this.lines[lineIdx];
    return this.lines.slice(0, lineIdx).join("").length + line.selection.end;
  }

  toString() {
    return this.lines.join("");
  }
}

export class Line {
  constructor(private value: string, private _selection: Selection) {}

  get selection() {
    return this._selection;
  }

  get isSelected() {
    return this.selection.isValid;
  }

  get hasTextSelected() {
    return this.selection.length > 0;
  }

  indent() {
    const indent = "  ";
    const newValue = indent + this.value;
    this.value = newValue;
    this._selection = new Selection(
      this.selection.start > 0 ? this.selection.start + indent.length : 0,
      this.selection.end >= 0 ? this.selection.end + indent.length : -1
    );
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

  insertText(text: string) {
    const before = this.value.substring(0, this.selection.start);
    const after = this.value.substring(this.selection.end);
    this.value = before + text + after;

    if (this.selection.isValid) {
      this._selection = this.selection.moveBy(text.length);
    }
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
  const isSelectionAfter = selection.start >= line.length;

  if (isSelectionBefore || isSelectionAfter) return new Selection();

  const start = Math.max(0, selection.start);
  const end = Math.min(selection.end, line.length);

  return new Selection(start, end);
}
