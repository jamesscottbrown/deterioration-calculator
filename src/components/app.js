import { useState } from "preact/hooks";

import {
  deterioration_score_table,
  morbidityProbabilityTable,
  initialState,
} from "../data/data";
import { Results } from "./Results";
import { Explanation } from "./Explanation";
import { Intro } from "./Intro";

import {
  tableLookup,
  morbidityScoreComponentNumeric,
  mortalityScoreComponentNumeric,
  morbidityScoreComponentDiscrete,
  mortalityScoreComponentDiscrete,
} from "./calculation";

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

const NumberMeasurement = ({ short_name, f, handleSelection, state }) => {
  const details = (help) =>
    help && (
      <details>
        <summary>Definition</summary>
        {help}
      </details>
    );

  const name = f.name;
  const help = f.help;

  const max_observed_value = f.morbidity.thresholds.slice(-1)[0][0];
  const min_observed_value = f.morbidity.thresholds[0][0];

  const updateScore = (value) => {
    let filteredValue = value;
    if (value < +min_observed_value || value > +max_observed_value) {
      filteredValue = NaN;
    }

    handleSelection(
      value,
      morbidityScoreComponentNumeric(f, filteredValue),
      mortalityScoreComponentNumeric(f, filteredValue)
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
                  morbidityScoreComponentDiscrete(f, usingAltUnits, value),
                  mortalityScoreComponentDiscrete(f, usingAltUnits, value)
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

const App = () => {
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

  totalMorbidityPoints = Object.values(state.morbidityScoreContribution).reduce(
    (a, b) => a + b,
    0
  );

  deteriorationProbability = tableLookup(
    morbidityProbabilityTable,
    totalMorbidityPoints
  );

  console.log(JSON.stringify(state));

  return (
    <div id="app">
      <base target="_parent" />

      <h1>4C Mortality & 4C Deterioration</h1>

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
    </div>
  );
};

export default App;
