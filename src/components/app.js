import { Component } from "preact";
import { useState } from "preact/hooks";
import CombinedRiskPlot from "./CombinedRiskPlot";

import {
  score_table,
  deterioration_score_table,
  scoreColors,
  mortality,
  morbidityProbabilityTable,
} from "./data";
import BothScoresPlot from "./BothScoresPlot";

const round = (num) => Math.round((num + Number.EPSILON) * 1) / 1;

const tableLookup = (table, v) => {
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

const Results = ({
  mortalityScore,
  totalMorbidityPoints,
  deteriorationProbability,
}) => {
  return mortalityScore !== null ? (
    <>
      <div
        class="centered"
        style={{
          border: `solid 4px ${scoreColors[mortalityScore]}`,
          "font-size": "1.5em",
          "margin-bottom": "15px",
        }}
      >
        Mortality score:
        <span
          style={{
            fontSize: "1.5em",
          }}
        >
          <b> {mortalityScore}</b>/21
        </span>{" "}
        <br />
        Risk of death:
        <span
          style={{
            fontSize: "1.5em",
          }}
        >
          <b> {round(mortality[mortalityScore])}%</b>
        </span>{" "}
        <br />
        <br />
        Morbidity score:
        <span
          style={{
            fontSize: "1.5em",
          }}
        >
          <b> {totalMorbidityPoints}</b>
        </span>{" "}
        <br />
        Risk of deterioration:
        <span
          style={{
            fontSize: "1.5em",
          }}
        >
          <b> {round(100 * deteriorationProbability)}%</b>
        </span>{" "}
        <br />
      </div>

      <BothScoresPlot
        mortalityScore={mortalityScore}
        morbidityScore={deteriorationProbability}
      />
    </>
  ) : (
    <p>
      <b>
        Please select a value for every variable to calculate a mortality score.
      </b>
    </p>
  );
};

const Intro = () => (
  <>
    <p>
      The 4C Mortality Score and 4C Deterioration models are risk stratification
      tools that predict in-hospital mortality or in-hospital clinical
      deterioration (defined as any requirement of ventilatory support or
      critical care, or death) for hospitalised COVID-19 patients, produced by
      the <a href="https://isaric4c.net/">ISARIC 4C consortium</a>.{" "}
      <b>They are intended for use by clinicians.</b>
    </p>
    <p>
      They are designed to require only parameters that are commonly available
      at hospital presentation.
    </p>
    <p>
      They are based on a UK cohort of patients, and should not be adopted for
      routine clinical use in other settings until it has been appropriately
      validated.
    </p>
    <p>
      For full details, see
      <a href="https://doi.org/10.1136/bmj.m3339"> the paper</a> introducing the
      mortality score, and the{" "}
      <a href="https://www.medrxiv.org/content/10.1101/2020.10.09.20209957v1">
        preprint
      </a>{" "}
      introducing the deterioration model.
    </p>
    <p>
      This is an infographic that visualises risk, based on observed mortality
      among hospitalised adult COVID19 patients recruited into the ISARIC 4C
      study in the UK.
    </p>
  </>
);

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

  return (
    <>
      <label for={short_name}>
        {name}:{details(help)}
      </label>

      <input
        class="form-control"
        type="number"
        step={f.step}
        id={short_name}
        style={{ "padding-bottom": "10px" }}
        onchange={(ev) =>
          handleSelection(
            +ev.target.value,
            morbidityScore(+ev.target.value),
            mortalityScore(+ev.target.value)
          )
        }
      />

      {typeof state.selection[short_name] !== "undefined" && (
        <p>
          Morbidity score <b>+{state.morbidityScoreContribution[short_name]}</b>
          ; Mortality score{" "}
          <b>+{state.mortalityScoreContribution[short_name]}</b>
        </p>
      )}
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

      {typeof state.selection[short_name] !== "undefined" && (
        <p>
          Morbidity score <b>+{state.morbidityScoreContribution[short_name]}</b>
          ; Mortality score{" "}
          <b>+{state.mortalityScoreContribution[short_name]}</b>
        </p>
      )}
    </>
  );
};

export default class App extends Component {
  render() {
    const [state, setState] = useState({
      selection: {},
      morbidityScoreContribution: {},
      mortalityScoreContribution: {},
    });

    const short_names = Object.keys(deterioration_score_table);
    const scores_array = short_names.map((f) => deterioration_score_table[f]);

    let totalMorbidityPoints = 0,
      deteriorationProbability = 0,
      mortalityScore = 0;

    console.log(Object.keys(state.selection).length, scores_array.length);

    if (Object.keys(state.selection).length < scores_array.length) {
      deteriorationProbability = null;
      mortalityScore = null;
      console.log("Score not set");
    } else {
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
    }

    return (
      <div id="app">
        <base target="_parent" />

        <h1>4C Mortality & 4C Deterioration</h1>

        <h2 style={{ color: "red" }}>
          This page should be considered a prototype that is under development.
        </h2>
        <Intro />

        <div
          style={{
            "max-width": "max-content",
            margin: "auto auto 2em 0",
          }}
        >
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
              <div class="measurement">
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
              </div>
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
