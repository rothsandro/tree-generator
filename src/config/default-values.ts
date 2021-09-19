import { TreeConfig } from "../types/config.types";

export function getDefaultTreeConfig(): TreeConfig {
  return {
    rootElement: true,
    alignComments: true,
  };
}

export function getDefaultInput(): string {
  return [
    "Generate a nice folder tree",
    "by editing this example.",
    "",
    "Use indentation to create",
    "nested folders and files.",
    'You can use "#” at the end',
    "of a line to add a comment.",
    "",
    "Here is an example:",
    "",
    "src",
    "  assets # Images, fonts and more",
    "    hero.png",
    "    logo.png",
    "  modules",
    "   feature-a # Each feature is a module",
    "     index.ts # Some code",
    "   feature-b",
    "     index.ts",
    "  App.test.tsx",
    "  App.ts",
  ].join("\n");
}
