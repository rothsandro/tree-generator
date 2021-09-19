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

Alpine.start();
