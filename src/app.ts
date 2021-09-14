import { parseInput } from "./core/parser";
import Alpine from "alpinejs";

Alpine.data("tree", () => ({
  input: "src/\nfile.txt",
  get output() {
    return parseInput(this.input);
  },
  get formattedOutput() {
    return JSON.stringify(this.output, null, 2);
  },
}));

Alpine.start();
