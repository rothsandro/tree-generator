import { parseInput } from "./core/parser";
import { convertItemsToText } from "./core/output";
import { TreeConfig } from "./types/config.types";
import { pipe } from "./utils/pipe";
import Alpine from "alpinejs";
import "./styles/index.scss";

const getDefaultTreeConfig = (): TreeConfig => ({
  rootElement: true,
});

Alpine.magic("persistTree", () => (input: string, config: TreeConfig) => {
  const store = { input, config };
  const data = pipe(store, JSON.stringify, btoa, encodeURIComponent);
  history.replaceState(undefined, undefined, `#${data}`);
});

Alpine.data("tree", () => ({
  makeUrlShareable: false,
  input: "src/\nfile.txt",
  treeConfig: getDefaultTreeConfig(),
  get items() {
    return parseInput(this.input);
  },
  get formattedOutput() {
    return convertItemsToText(this.items, this.treeConfig);
  },
  enableShareUrl() {
    this.makeUrlShareable = true;
  },
  init() {
    Alpine.effect(() => {
      this.makeUrlShareable && this.$persistTree(this.input, this.treeConfig);
    });
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
