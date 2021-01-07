export const tableLookup = (table, v) => {
  if (isNaN(v)) {
    return NaN;
  }

  let i = -1;
  while (i < table.length - 1) {
    if (v >= table[i + 1][0]) {
      i += 1;
    } else {
      break;
    }
  }

  if (i === -1) {
    return 0;
  }
  return table[i][1];
};

const sum = (x) => x.reduce((a, b) => a + b, 0);

export const morbidityScoreComponentNumeric = (f, v) => {
  if (f.morbidity === null) {
    return 0;
  }

  if (f.morbidity.spline) {
    const spline = f.morbidity.spline;

    return (
      spline.a +
      spline.b * v +
      sum(spline.points.map((p) => p[0] * Math.max(v - p[1], 0) ** 3))
    );
  } else if (f.morbidity.thresholds) {
    return tableLookup(f.morbidity.thresholds, v);
  }
};

export const mortalityScoreComponentNumeric = (f, v) => {
  if (f.mortality === null) {
    return 0;
  }

  return tableLookup(f.mortality.thresholds, v);
};

export const morbidityScoreComponentDiscrete = (f, usingAltUnits, value) => {
  const morbidityScores =
    f.morbidity && (usingAltUnits ? f.morbidity.altScores : f.morbidity.scores);

  return morbidityScores ? morbidityScores[value] : 0;
};

export const mortalityScoreComponentDiscrete = (f, usingAltUnits, value) => {
  const mortalityScores =
    f.mortality && (usingAltUnits ? f.mortality.altScores : f.mortality.scores);

  return mortalityScores ? mortalityScores[value] : 0;
};
