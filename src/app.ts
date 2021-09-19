import { parseInput } from "./core/parser";
import { convertItemsToText } from "./core/output";
import { TreeConfig } from "./types/config.types";
import { pipe } from "./utils/pipe";
import { getDefaultInput, getDefaultTreeConfig } from "./config/default-values";
import { TreeStore } from "./types/store.types";
import Alpine from "alpinejs";
import "./styles/index.scss";

Alpine.data("treeUrlStore", function () {
  return {
    autoUpdateStore: false,
    getShareUrl() {
      return window.location.href;
    },
    enableAutoUpdate() {
      this.autoUpdateStore = true;
    },
    readFromStore(): TreeStore | null {
      try {
        const data = window.location.hash.substr(1);
        if (!data) return null;
        const store = pipe(data, atob, escape, decodeURIComponent, JSON.parse);
        const input: string = store.input || "";
        const treeConfig: TreeConfig = store.treeConfig || {};
        return { input, treeConfig };
      } catch (err) {
        return null;
      }
    },
    buildData(input: string, treeConfig: TreeConfig) {
      const store = { input, treeConfig };
      const data = pipe(
        store,
        JSON.stringify,
        encodeURIComponent,
        unescape,
        btoa
      );
      return data;
    },
    writeToStore(input: string, treeConfig: TreeConfig) {
      window.history.replaceState(
        undefined,
        "",
        `#${this.buildData(input, treeConfig)}`
      );
    },
    init() {
      this.autoUpdateStore = !!this.readFromStore();
    },
  };
});

Alpine.data("tree", function (initial?: TreeStore) {
  let input = getDefaultInput();
  let treeConfig = getDefaultTreeConfig();

  if (initial) {
    input = initial.input;
    treeConfig = Object.assign(treeConfig, initial.treeConfig);
  }

  return {
    input,
    treeConfig,
    get items() {
      return parseInput(this.input);
    },
    get formattedOutput() {
      return convertItemsToText(this.items, this.treeConfig);
    },
  };
});

Alpine.data("clipboard", () => ({
  _timer: 0,
  copied: false,
  copy(content: string) {
    window.clearTimeout(this._timer);
    window.navigator.clipboard
      .writeText(content)
      .then(
        () =>
          new Promise<void>((resolve) => {
            this.copied = true;
            this._timer = window.setTimeout(() => {
              this.copied = false;
              resolve();
            }, 800);
          })
      )
      .then(() => (this.copied = false))
      .catch(() => alert("Sorry, something went wrong"));
  },
}));

Alpine.magic("allowTabs", () => {
  const spaces = "  ";
  return {
    ["@keydown.tab"](event: KeyboardEvent) {
      const input = event.target as HTMLTextAreaElement;
      const value = input.value;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = value.substring(0, start) + spaces + value.substring(end);
      input.selectionEnd = start + spaces.length;
      input.selectionStart = input.selectionEnd;
      event.preventDefault();
    },
  };
});

Alpine.start();
