import { Editor, Selection } from "./editor";

export class TextArea {
  constructor(private readonly input: HTMLTextAreaElement) {}

  createEditor() {
    return new Editor(
      this.input.value,
      new Selection(this.input.selectionStart, this.input.selectionEnd)
    );
  }

  applyEditor(editor: Editor) {
    const selection = editor.selection;
    this.input.value = editor.toString();
    this.input.setSelectionRange(selection.start, selection.end);
  }
}
