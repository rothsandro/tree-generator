import { sum } from "./demo";

test("sum", () => {
  const result = sum(10, 20);
  expect(result).toBe(30);
});
