import { parseInput } from "./core/parser";
import Alpine from "alpinejs";

Alpine.data("tree", () => {
  const input = "src/\nfile.txt";
  const output = parseInput(input);
  return { output };
});

Alpine.start();
