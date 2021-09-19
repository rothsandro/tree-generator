import { TreeConfig } from "../types/config.types";

export function getDefaultTreeConfig(): TreeConfig {
  return {
    rootElement: false,
  };
}

export function getDefaultInput(): string {
  return `src\n  file.txt`;
}
