import {
  morbidityScoreComponentDiscrete,
  mortalityScoreComponentDiscrete,
  morbidityScoreComponentNumeric,
  mortalityScoreComponentNumeric,
  tableLookup,
} from "../src/components/calculation";
import {
  deterioration_score_table,
  morbidityProbabilityTable,
  mortality,
} from "../src/data/data";

const patients = [
  {
    measurements: {
      age: 41,
      sex: "Male",
      comorbidities: "0",
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 21,
      oxygen_saturation: 98,
      oxygen: "No",
      gcs: "15",
      urea: 5,
      crp: 31,
      lymphocytes: 0.8,
    },
    deterioration: 0.158,
    mortality: 0.8,
  },
  {
    measurements: {
      age: 36,
      sex: "Male",
      comorbidities: "0",
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 18,
      oxygen_saturation: 95,
      oxygen: "No",
      gcs: "15",
      urea: 3,
      crp: 68,
      lymphocytes: 0.4,
    },
    deterioration: 0.198,
    mortality: 0.8,
  },
  {
    measurements: {
      age: 77,
      sex: "Female",
      comorbidities: "1",
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 36,
      oxygen_saturation: 99,
      oxygen: "No",
      gcs: "15",
      urea: 6,
      crp: 12,
      lymphocytes: 0.9,
    },
    deterioration: 0.242,
    mortality: 19.2,
  },
  {
    measurements: {
      age: 84,
      sex: "Female",
      comorbidities: "1",
      nosocomial: "No",
      infiltrates: "No",
      respiratory_rate: 17,
      oxygen_saturation: 92,
      oxygen: "No",
      gcs: "<15",
      urea: 6,
      crp: 25,
      lymphocytes: 0.6,
    },
    deterioration: 0.321,
    mortality: 22.9,
  },
  {
    measurements: {
      age: 70,
      sex: "Male",
      comorbidities: "0",
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 22,
      oxygen_saturation: 93,
      oxygen: "No",
      gcs: "15",
      urea: 6,
      crp: 104,
      lymphocytes: 0.7,
    },
    deterioration: 0.393,
    mortality: 22.9,
  },
  {
    measurements: {
      age: 60,
      sex: "Female",
      comorbidities: "⩾2", // 2
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 24,
      oxygen_saturation: 96,
      oxygen: "No",
      gcs: "<15",
      urea: 18,
      crp: 42,
      lymphocytes: 1,
    },
    deterioration: 0.496,
    mortality: 32.9, // modified
  },
  {
    measurements: {
      age: 76,
      sex: "Male",
      comorbidities: "⩾2", // 2
      nosocomial: "No",
      infiltrates: "No",
      respiratory_rate: 30,
      oxygen_saturation: 91,
      oxygen: "Yes",
      gcs: "15",
      urea: 5,
      crp: 70,
      lymphocytes: 8.4,
    },
    deterioration: 0.551,
    mortality: 44.6,
  },
  {
    measurements: {
      age: 56,
      sex: "Male",
      comorbidities: "0",
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 26,
      oxygen_saturation: 95,
      oxygen: "Yes",
      gcs: "15",
      urea: 9,
      crp: 120,
      lymphocytes: 0.9,
    },
    deterioration: 0.621,
    mortality: 11.7,
  },
  {
    measurements: {
      age: 88,
      sex: "Female",
      comorbidities: "⩾2", // ==4
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 24,
      oxygen_saturation: 86,
      oxygen: "Yes",
      gcs: "15",
      urea: 6,
      crp: 160,
      lymphocytes: 1.1,
    },
    deterioration: 0.736,
    mortality: 44.6,
  },
  {
    measurements: {
      age: 80,
      sex: "Male",
      comorbidities: "⩾2", // ==4
      nosocomial: "No",
      infiltrates: "Yes",
      respiratory_rate: 28,
      oxygen_saturation: 91,
      oxygen: "Yes",
      gcs: "15",
      urea: 13,
      crp: 118,
      lymphocytes: 0.7,
    },
    deterioration: 0.807,
    mortality: 59.1,
  },
];

const absDiff = (a, b) => Math.abs(a - b);

const computeProbabilities = (patient) => {
  let morbidityPoints = 0,
    mortalityPoints = 0;

  for (let short_name of Object.keys(patient.measurements)) {
    const f = deterioration_score_table[short_name];
    const value = patient.measurements[short_name];

    if (f.type === "boolean") {
      morbidityPoints += morbidityScoreComponentDiscrete(f, false, value);
      mortalityPoints += mortalityScoreComponentDiscrete(f, false, value);
    } else {
      morbidityPoints += morbidityScoreComponentNumeric(f, value);
      mortalityPoints += mortalityScoreComponentNumeric(f, value);
    }
  }

  return [
    tableLookup(morbidityProbabilityTable, morbidityPoints),
    mortality[mortalityPoints],
  ];
};

describe("Do full calculation for example patients", () => {
  test.each(patients)("test patient %i", (patient) => {
    const [morbidityProbability, mortalityProbability] = computeProbabilities(
      patient
    );

    const deteriorationDifference = absDiff(
      morbidityProbability,
      patient.deterioration
    );
    console.log(
      `${deteriorationDifference} = abs(${morbidityProbability} - ${patient.deterioration})`
    );

    expect(deteriorationDifference < 0.1).toBe(true);

    expect(absDiff(mortalityProbability, patient.mortality) < 0.1).toBe(true);
  });
});
