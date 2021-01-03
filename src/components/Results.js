import { mortality, scoreColors } from "../data/data";
import BothScoresPlot from "./BothScoresPlot";

const round = (num) => Math.round((num + Number.EPSILON) * 1) / 1;

export const Results = ({
  mortalityScore,
  totalMorbidityPoints,
  deteriorationProbability,
}) => {
  const showMortality = mortalityScore !== null && !isNaN(mortalityScore);
  const showDeterioration =
    deteriorationProbability !== null && !isNaN(deteriorationProbability);

  if (!showMortality && !showDeterioration) {
    return <b>Please select a value for every variable to calculate scores.</b>;
  }

  return (
    <>
      {!showMortality && (
        <b>
          Please select a value for remaining variables to calculate Mortality
          score.
        </b>
      )}

      {!showDeterioration && (
        <b>
          Please select a value for remaining variables to calculate
          Deterioration score.
        </b>
      )}

      <div
        class="centered"
        style={{
          border: showMortality
            ? `solid 4px ${scoreColors[mortalityScore]}`
            : `solid 2px grey`,
          "font-size": "1.5em",
          "margin-bottom": "15px",
        }}
      >
        {showMortality && (
          <>
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
          </>
        )}

        {showMortality && showDeterioration && <br />}

        {showDeterioration && (
          <>
            Deterioration score:
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
          </>
        )}
      </div>

      {showMortality && showDeterioration && (
        <BothScoresPlot
          mortalityScore={mortalityScore}
          morbidityScore={deteriorationProbability}
        />
      )}
    </>
  );
};
