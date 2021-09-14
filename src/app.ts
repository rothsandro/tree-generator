import { parseInput } from "./core/parser";
import Alpine from "alpinejs";

Alpine.data("treeGenerator", () => {
  const input = "src/\nfile.txt";
  const output = parseInput(input);
  const formattedOutput = JSON.stringify(output, null, 2);
  return { input, output, formattedOutput };
});

Alpine.start();
