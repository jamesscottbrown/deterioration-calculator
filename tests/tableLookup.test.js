import { tableLookup } from "../src/components/calculation";

const table = [
  [0, 0.031],
  [4, 0.032],
  [8, 0.033],
];

describe("correctly looks up final probability based on score", () => {
  test("Handles values of 0", () => {
    expect(tableLookup(table, 0)).toBe(0.031);
  });

  test("value correct between thresholds", () => {
    expect(tableLookup(table, 2)).toBe(0.031);
  });

  test("value changes at first threshold", () => {
    expect(tableLookup(table, 4)).toBe(0.032);
  });

  test("value change at final threshold", () => {
    expect(tableLookup(table, 8)).toBe(0.033);
  });

  test("value correct past final threshold", () => {
    expect(tableLookup(table, 10)).toBe(0.033);
  });
});
