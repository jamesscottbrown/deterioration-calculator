import {
  morbidityScoreComponentDiscrete,
  mortalityScoreComponentDiscrete,
} from "../src/components/calculation";

const scoring = {
  type: "boolean",
  options: ["Female", "Male"],
  morbidity: {
    scores: {
      Female: 0,
      Male: 35,
    },
  },
  mortality: {
    scores: {
      Female: 0,
      Male: 1,
    },
  },
  name: "Sex at birth",
};

describe("correctly evaluates morbidityScoreComponentDiscrete", () => {
  test("Handles first option", () => {
    expect(morbidityScoreComponentDiscrete(scoring, false, "Female")).toBe(0);
  });

  test("Handles second option", () => {
    expect(morbidityScoreComponentDiscrete(scoring, false, "Male")).toBe(35);
  });
});

describe("correctly evaluates mortalityScoreComponentDiscrete", () => {
  test("Handles first option", () => {
    expect(mortalityScoreComponentDiscrete(scoring, false, "Female")).toBe(0);
  });

  test("Handles second option", () => {
    expect(mortalityScoreComponentDiscrete(scoring, false, "Male")).toBe(1);
  });
});
