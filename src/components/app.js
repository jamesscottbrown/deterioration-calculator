import { Component } from "preact";
import { useState } from "preact/hooks";

import {
  deterioration_score_table,
  morbidityProbabilityTable,
  initialState,
} from "../data/data";
import { Results } from "./Results";
import { Explanation } from "./Explanation";
import { Intro } from "./Intro";

const tableLookup = (table, v) => {
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

const WhatYouShouldDo = () => (
  <div>
    <h2>What you should do</h2>
    <p>
      It is important that <i>everyone</i> follows the Government's advice on{" "}
      <a href="https://www.gov.uk/government/publications/staying-alert-and-safe-social-distancing">
        Staying alert and safe (social distancing)
      </a>
      , and on{" "}
      <a href="https://www.gov.uk/government/publications/covid-19-stay-at-home-guidance">
        self-isolating
      </a>{" "}
      if they or someone in their household has symptoms of COVID-19. This is
      important not only to protect yourself, but also to prevent you from
      accidentally infecting more vulnerable people.
    </p>

    <p>
      People who are defined as extremely vulnerable on medical grounds should
      also follow the government's{" "}
      <a href="https://www.gov.uk/government/publications/guidance-on-shielding-and-protecting-extremely-vulnerable-persons-from-covid-19">
        advice on shielding
      </a>
      .
    </p>

    <p>
      If you think that you might have COVID-19, you should stay at home and
      consult the{" "}
      <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/check-if-you-have-coronavirus-symptoms/">
        NHS Website
      </a>{" "}
      for advice.
    </p>
  </div>
);

const ScoreContribution = ({ state, short_name }) => {
  return (
    <>
      <p style={{ textAlign: "right" }}>
        {deterioration_score_table[short_name].morbidity === null ? (
          "n/a"
        ) : typeof state.selection[short_name] !== "undefined" &&
          isNaN(state.morbidityScoreContribution[short_name]) ? (
          <b style={{ color: "red" }}>Invalid</b>
        ) : (
          typeof state.selection[short_name] !== "undefined" && (
            <b>+{state.morbidityScoreContribution[short_name]}</b>
          )
        )}
      </p>

      <p style={{ textAlign: "right" }}>
        {deterioration_score_table[short_name].mortality === null ? (
          "n/a"
        ) : typeof state.selection[short_name] !== "undefined" &&
          isNaN(state.mortalityScoreContribution[short_name]) ? (
          <b style={{ color: "red" }}>Invalid</b>
        ) : (
          typeof state.selection[short_name] !== "undefined" && (
            <b>+{state.mortalityScoreContribution[short_name]}</b>
          )
        )}
      </p>
    </>
  );
};

const NumberMeasurement = ({
  short_name,
  f,
  selection,
  handleSelection,
  state,
}) => {
  const details = (help) =>
    help && (
      <details>
        <summary>Definition</summary>
        {help}
      </details>
    );

  const name = f.name;
  const help = f.help;

  const sum = (x) => x.reduce((a, b) => a + b, 0);

  const morbidityScore = (v) => {
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

  const mortalityScore = (v) => {
    if (f.mortality === null) {
      return 0;
    }

    return tableLookup(f.mortality.thresholds, v);
  };

  const max_observed_value = f.morbidity.thresholds.slice(-1)[0][0];
  const min_observed_value = f.morbidity.thresholds[0][0];

  const updateScore = (value) => {
    let filteredValue = value;
    if (value < +min_observed_value || value > +max_observed_value) {
      filteredValue = NaN;
    }

    handleSelection(
      value,
      morbidityScore(filteredValue),
      mortalityScore(filteredValue)
    );
  };

  return (
    <>
      <div>
        <label for={short_name}>
          {name}:{details(help)}
        </label>

        <input
          class="form-control"
          type="number"
          step={f.step}
          id={short_name}
          style={{ "padding-bottom": "10px" }}
          onchange={(ev) => updateScore(ev.target.value)}
        />

        {f.morbidity.thresholds &&
          state.selection[short_name] < min_observed_value && (
            <p style={{ color: "red" }}>
              Value is too low (minimum observed is {min_observed_value})
            </p>
          )}

        {f.morbidity.thresholds &&
          state.selection[short_name] > max_observed_value && (
            <p style={{ color: "red" }}>
              Value is too high (maximum observed is {max_observed_value})
            </p>
          )}
      </div>

      <ScoreContribution state={state} short_name={short_name} />
    </>
  );
};

const DiscreteMeasurement = ({
  short_name,
  f,
  selection,
  handleSelection,
  state,
}) => {
  const [usingAltUnits, setUsingAltUnits] = useState(false);

  const details = (help) =>
    help && (
      <details>
        <summary>Definition</summary>
        {help}
      </details>
    );

  const SwitchButton = () => {
    if (!f.altName) {
      return null;
    }

    return (
      <button
        onClick={() => setUsingAltUnits(!usingAltUnits)}
        class="units-button"
      >
        Use {usingAltUnits ? f.name : f.altName}
      </button>
    );
  };

  const morbidityScores =
    f.morbidity && (usingAltUnits ? f.morbidity.altScores : f.morbidity.scores);
  const mortalityScores =
    f.mortality && (usingAltUnits ? f.mortality.altScores : f.mortality.scores);

  const values = f.options;
  const name = usingAltUnits ? f.altName : f.name;
  const help = f.help;

  return (
    <>
      <div style={{}}>
        <label for={short_name}>
          {name}:{details(help)}
        </label>

        <div id={short_name} role="group" class="btn-group">
          {values.map((value) => (
            <button
              class={
                selection[short_name] === value
                  ? "btn btn-secondary"
                  : "btn btn-outline-secondary"
              }
              onclick={() =>
                handleSelection(
                  value,
                  morbidityScores ? morbidityScores[value] : 0,
                  mortalityScores ? mortalityScores[value] : 0
                )
              }
            >
              {value}
            </button>
          ))}
        </div>

        <SwitchButton />
      </div>

      <ScoreContribution state={state} short_name={short_name} />
    </>
  );
};

export default class App extends Component {
  render() {
    // TODO: prepopulate with NaN

    const [state, setState] = useState(initialState);

    const short_names = Object.keys(deterioration_score_table);
    const scores_array = short_names.map((f) => deterioration_score_table[f]);

    let totalMorbidityPoints = 0,
      deteriorationProbability = 0,
      mortalityScore = 0;

    console.log(Object.keys(state.selection).length, scores_array.length);

    mortalityScore = Object.values(state.mortalityScoreContribution).reduce(
      (a, b) => a + b,
      0
    );

    totalMorbidityPoints = Object.values(
      state.morbidityScoreContribution
    ).reduce((a, b) => a + b, 0);

    //morbidityScore = 1 / (1 + Math.exp(-total));

    deteriorationProbability = tableLookup(
      morbidityProbabilityTable,
      totalMorbidityPoints
    );

    console.log(JSON.stringify(state));

    return (
      <div id="app">
        <base target="_parent" />

        <h1>4C Mortality & 4C Deterioration</h1>

        <h2 style={{ color: "red" }}>
          This page should be considered a prototype that is under development.
        </h2>
        <Intro />

        <Explanation />

        <br />

        <div
          style={{
            "max-width": "max-content",
            margin: "auto auto 2em 0",
            display: "grid",
            gridTemplateColumns: "auto 86px 65px",
            gridColumnGap: "1em",
            gridRowGap: "15px",
          }}
        >
          <div />
          <b style={{ borderBottom: "solid gray 1px" }}>Deterioration score</b>
          <b style={{ borderBottom: "solid gray 1px" }}>Mortality score</b>

          {scores_array.map((f, i) => {
            const short_name = short_names[i];

            const handleSelection = (
              newValue,
              morbidityScoreContribution,
              mortalityScoreContribution
            ) => {
              console.log(
                `Measurement ${short_name}=${newValue} contributes ${morbidityScoreContribution} to deterioration score and ${mortalityScoreContribution} to mortality score`
              );

              setState({
                selection: { ...state.selection, [short_name]: newValue },
                morbidityScoreContribution: {
                  ...state.morbidityScoreContribution,
                  [short_name]: morbidityScoreContribution,
                },
                mortalityScoreContribution: {
                  ...state.mortalityScoreContribution,
                  [short_name]: mortalityScoreContribution,
                },
              });
            };

            return (
              <>
                {f.type === "boolean" ? (
                  <DiscreteMeasurement
                    f={f}
                    short_name={short_name}
                    selection={state.selection}
                    handleSelection={handleSelection}
                    state={state}
                  />
                ) : (
                  <NumberMeasurement
                    f={f}
                    short_name={short_name}
                    selection={state.selection}
                    handleSelection={handleSelection}
                    state={state}
                  />
                )}
              </>
            );
          })}
        </div>

        <Results
          mortalityScore={mortalityScore}
          totalMorbidityPoints={totalMorbidityPoints}
          deteriorationProbability={deteriorationProbability}
        />
        <br />
        {/* <WhatYouShouldDo /> */}
      </div>
    );
  }
}
