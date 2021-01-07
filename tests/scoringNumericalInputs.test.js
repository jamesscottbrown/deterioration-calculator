import {
  morbidityScoreComponentNumeric,
  mortalityScoreComponentNumeric,
} from "../src/components/calculation";

const scoring = {
  type: "number",
  step: 1,
  name: "Age (years)",
  morbidity: {
    thresholds: [
      [18, 0],
      [19, 2],
      [20, 5],
      [21, 7],
      [22, 9],
      [23, 12],
      [24, 14],
      [25, 16],
      [26, 18],
      [27, 21],
      [28, 23],
      [29, 25],
      [30, 28],
      [31, 30],
      [32, 32],
      [33, 35],
      [34, 37],
      [35, 39],
      [36, 42],
      [37, 44],
      [38, 46],
      [39, 48],
      [40, 51],
      [41, 53],
      [42, 55],
      [43, 58],
      [44, 60],
      [45, 62],
      [46, 64],
      [47, 67],
      [48, 69],
      [49, 71],
      [50, 73],
      [51, 75],
      [52, 77],
      [53, 79],
      [54, 81],
      [55, 83],
      [56, 84],
      [57, 86],
      [58, 88],
      [59, 89],
      [60, 91],
      [61, 92],
      [62, 93],
      [63, 95],
      [64, 96],
      [65, 97],
      [66, 98],
      [67, 99],
      [68, 99],
      [69, 100],
      [70, 100],
      [71, 101],
      [72, 101],
      [73, 102],
      [74, 103],
      [75, 103],
      [76, 104],
      [77, 105],
      [78, 106],
      [79, 108],
      [80, 110],
      [81, 112],
      [82, 114],
      [83, 117],
      [84, 119],
      [85, 123],
      [86, 126],
      [87, 130],
      [88, 133],
      [89, 137],
      [90, 141],
      [91, 146],
      [92, 150],
      [93, 154],
      [94, 158],
      [95, 162],
      [96, 167],
      [97, 171],
      [98, 175],
      [99, 179],
      [100, 183],
      [101, 188],
      [102, 192],
      [103, 196],
      [104, 200],
      [105, 204],
      [106, 209],
      [107, 213],
      [108, 217],
      [109, 221],
      [110, 226],
    ],
  },
  mortality: {
    thresholds: [
      [50, 2],
      [60, 4],
      [70, 6],
      [80, 7],
    ],
  },
};

describe("correctly evaluates mortalityScoreComponentNumeric", () => {
  test("Handles values below first threshold", () => {
    expect(mortalityScoreComponentNumeric(scoring, 49)).toBe(0);
  });

  test("value changes at first threshold", () => {
    expect(mortalityScoreComponentNumeric(scoring, 50)).toBe(2);
  });

  test("value correct between thresholds", () => {
    expect(mortalityScoreComponentNumeric(scoring, 55)).toBe(2);
  });

  test("value change at threshold", () => {
    expect(mortalityScoreComponentNumeric(scoring, 60)).toBe(4);
  });

  test("value correct at final threshold", () => {
    expect(mortalityScoreComponentNumeric(scoring, 80)).toBe(7);
  });

  test("value correct past final threshold", () => {
    expect(mortalityScoreComponentNumeric(scoring, 90)).toBe(7);
  });
});

describe("correctly evaluates morbidityScoreComponentNumeric", () => {
  test("Handles values below first threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 5)).toBe(0);
  });

  test("value changes at first threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 18)).toBe(0);
  });

  test("value between threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 18.5)).toBe(0);
  });

  test("value correct at 2nd", () => {
    expect(morbidityScoreComponentNumeric(scoring, 19)).toBe(2);
  });

  test("value correct past 2nd", () => {
    expect(morbidityScoreComponentNumeric(scoring, 19.6)).toBe(2);
  });

  test("value change at penultimate threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 109)).toBe(221);
  });

  test("value correct at final threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 110)).toBe(226);
  });

  test("value correct past final threshold", () => {
    expect(morbidityScoreComponentNumeric(scoring, 150)).toBe(226);
  });
});
