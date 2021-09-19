import { parseInput } from "./core/parser";
import { convertItemsToText } from "./core/output";
import Alpine from "alpinejs";
import "./styles/index.scss";

Alpine.data("tree", () => ({
  input: "src/\nfile.txt",
  get items() {
    return parseInput(this.input);
  },
  get formattedOutput() {
    return convertItemsToText(this.items);
  },
}));

Alpine.data("clipboard", () => ({
  _timer: 0,
  copied: false,
  copy(content: string) {
    clearTimeout(this._timer);
    window.navigator.clipboard
      .writeText(content)
      .then(
        () =>
          new Promise<void>((resolve) => {
            this.copied = true;
            this._timer = setTimeout(() => {
              this.copied = false;
              resolve();
            }, 800);
          })
      )
      .then(() => (this.copied = false))
      .catch(() => alert("Sorry, something went wrong"));
  },
}));

Alpine.start();
