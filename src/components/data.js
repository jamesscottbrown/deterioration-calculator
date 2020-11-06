const deterioration_score_table = {
  nosocomial: {
    type: "boolean",
    options: ["No", "Yes"],
    morbidity: {
      scores: {
        No: 0,
        Yes: 0.30264598,
      },
    },
    mortality: null,
    name: "Nosocomial",
    help:
      "Defined as symptom onset or first positive SARS-CoV-2 PCR more than 7 days after admission",
  },

  sex: {
    type: "boolean",
    options: ["Female", "Male"],
    morbidity: {
      scores: {
        Female: 0,
        Male: 0.23828712,
      },
    },
    mortality: {
      scores: {
        Female: 0,
        Male: 1,
      },
    },
    name: "Sex at birth",
  },

  comorbidities: {
    type: "boolean",
    options: ["0", "1", "⩾2"],
    morbidity: null,
    mortality: {
      scores: {
        "0": 0,
        "1": 1,
        "⩾2": 2,
      },
    },
    name: "Number of comorbidities",
    help:
      "Chronic cardiac disease; chronic respiratory disease (excluding asthma); chronic renal disease (estimated\n" +
      "glomerular filtration rate ≤30); mild-to-severe liver disease; dementia; chronic neurological conditions;\n" +
      "connective tissue disease; diabetes mellitus (diet, tablet or insulin-controlled); HIV/AIDS;\n" +
      "malignancy; clinician-defined obesity.",
  },

  infiltrates: {
    type: "boolean",
    options: ["No", "Yes"],
    morbidity: {
      scores: {
        No: 0,
        Yes: 0.31847127,
      },
    },
    name: "Radiographic chest infiltrates",
  },

  oxygen: {
    type: "boolean",
    options: ["No", "Yes"],
    morbidity: {
      scores: {
        No: 0,
        Yes: 0.7445508,
      },
    },
    name: "Receiving oxygen",
  },

  gcs: {
    type: "boolean",
    options: ["<15", "15"],
    morbidity: {
      scores: {
        "<15": +0.60850246,
        "15": 0,
      },
    },
    mortality: {
      scores: {
        "<15": 2,
        "15": 0,
      },
    },
    name: "Glasgow Coma Scale",
  },

  age: {
    type: "number",
    step: 1,
    name: "Age (years)",
    morbidity: {
      spline: {
        a: 3.9477675,
        b: 0.015879049,
        points: [
          [-4.4564722e-6, 38.512329],
          [+4.28408e-5, 67.709726],
          [-7.1088239e-5, 81.136986],
          [+3.2703912e-5, 92.917808],
        ],
      },
    },
    mortality: {
      thresholds: [
        [50, 2],
        [60, 4],
        [70, 6],
        [80, 7],
      ],
    },
  },

  respiratory_rate: {
    type: "number",
    step: 1,
    name: "Respiratory Rate (breaths/min)",
    morbidity: {
      spline: {
        a: 0,
        b: -0.014521958,
        points: [
          [+0.0013714322, 16],
          [-0.0024680963, 19],
          [+0.0012019736, 24],
          [-0.00010530953, 37],
        ],
      },
    },
    mortality: {
      thresholds: [
        [20, 1],
        [30, 2],
      ],
    },
  },

  oxygen_saturation: {
    type: "number",
    step: 1,
    name: "Admission oxygen saturation (%)",
    morbidity: {
      spline: {
        a: 0,
        b: -0.069756781,
        points: [
          [-9.7878243e-5, 84],
          [+0.0039440211, 94],
          [-0.0055245187, 96],
          [+0.0016783758, 100],
        ],
      },
    },
    mortality: {
      thresholds: [
        [0, 2],
        [92, 0],
      ],
    },
  },

  urea: {
    type: "number",
    step: 0.001,
    name: "Urea (mmol/L)",
    morbidity: {
      spline: {
        a: 0,
        b: +0.053063087,
        points: [
          [+0.00085886997, 2.9],
          [-0.0020481614, 5.7],
          [+0.0012904492, 9.1],
          [-0.00010115771, 25.3],
        ],
      },
    },
    mortality: {
      thresholds: [
        [7, 1],
        [14, 3],
      ],
    },
  },

  crp: {
    type: "number",
    step: 0.001,
    name: "CRP (mg/L)",
    morbidity: {
      spline: {
        a: 0,
        b: +0.0097987358,
        points: [
          [-4.6646557e-7, 5],
          [+6.9431888e-7, 45],
          [-2.0921347e-7, 112],
          [-1.8639842e-8, 294],
        ],
      },
    },
    mortality: {
      thresholds: [
        [50, 1],
        [100, 2],
      ],
    },
  },

  lymphocytes: {
    type: "number",
    step: 0.001,
    name: "Lymphocytes (× 10⁹/L)",
    morbidity: {
      spline: {
        a: 0,
        b: -0.47068824,
        points: [
          [+0.20729218, 0.3],
          [-0.27907857, 0.7],
          [+0.03009229, 1.1],
          [+0.041694093, 2.4],
        ],
      },
    },
    mortality: null,
  },
};

/* Table 2 of paper */
const score_table = {
  age: {
    scores: {
      "18-49": 0,
      "50-59": 2,
      "60-69": 4,
      "70-79": 6,
      "⩾80": 7,
    },
    name: "Age (years)",
  },
  sex: {
    scores: {
      Female: 0,
      Male: 1,
    },
    name: "Sex at birth",
  },
  comorbidities: {
    scores: {
      "0": 0,
      "1": 1,
      "⩾2": 2,
    },
    name: "Number of comorbidities",
    help:
      "Chronic cardiac disease; chronic respiratory disease (excluding asthma); chronic renal disease (estimated\n" +
      "glomerular filtration rate ≤30); mild-to-severe liver disease; dementia; chronic neurological conditions;\n" +
      "connective tissue disease; diabetes mellitus (diet, tablet or insulin-controlled); HIV/AIDS;\n" +
      "malignancy; clinician-defined obesity.",
  },
  respiratory_rate: {
    scores: {
      "<20": 0,
      "20-29": 1,
      "⩾30": 2,
    },
    name: "Respiratory rate (breaths/minutes)",
  },
  oxygen_saturation: {
    scores: {
      "<92": 2,
      "⩾92": 0,
    },
    name: "Peripheral oxygen saturation on room air (%)",
  },
  gcs: {
    scores: {
      "<15": 2,
      "15": 0,
    },
    order: ["<15", "15"],
    name: "Glasgow Coma Scale",
  },
  urea: {
    scores: {
      "⩽7": 0,
      "7-14": 1,
      ">14": 3,
    },
    name: "Urea (mmol/L)",
    altScores: {
      "⩽19.6": 0,
      "19.6-39.2": 1,
      ">39.2": 3,
    },
    altName: "BUN (mg/dL)",
  },
  crp: {
    scores: {
      "<50": 0,
      "50-99": 1,
      "⩾100": 2,
    },
    name: "CRP (mg/L)",
    altScores: {
      "<5": 0,
      "5-9.9": 1,
      "⩾10": 2,
    },
    altName: "CRP (mg/dL)",
  },
};

/* Model Validation (p. 19/61) */
const categories = [
  { name: "Low", min: 0, max: 3, color: "#fee5d9", mortality: "1.2%" },
  { name: "Intermediate", min: 4, max: 8, color: "#fcae91", mortality: "9.9%" },
  { name: "High", min: 9, max: 14, color: "#fb6a4a", mortality: "31.4%" },
  { name: "Very High", min: 15, max: 21, color: "#cb181d", mortality: "61.5%" },
];

/* Extracted from bars in Fig 2A */
const counts = [
  160,
  329,
  485,
  645,
  759,
  759,
  919,
  1097,
  1308,
  1620,
  1864,
  2050,
  2185,
  2118,
  1780,
  1455,
  1109,
  725,
  455,
  223,
  101,
  33,
];

/* Sent by Ewen over Slack */
const mortality = [
  0,
  0.2976190476190476,
  0.8064516129032258,
  2.3112480739599386,
  4.805194805194805,
  7.474226804123711,
  7.783783783783784,
  11.695376246600182,
  14.448669201520913,
  19.164619164619165,
  22.899946495452113,
  26.91561590688652,
  32.90793072014585,
  40.13188883655205,
  44.57494407158837,
  51.63934426229508,
  59.10313901345292,
  66.12244897959184,
  75.80993520518359,
  77.3913043478261,
  82.88288288288288,
  87.5,
];

const allScores = Array.apply(null, Array(21 + 1)).map((_, i) => i);

let scoreColors = [];
for (let j in categories) {
  const cat = categories[j];
  for (let i = cat.min; i <= cat.max; i++) {
    scoreColors[i] = cat.color;
  }
}

export {
  score_table,
  categories,
  counts,
  mortality,
  allScores,
  scoreColors,
  deterioration_score_table,
};
