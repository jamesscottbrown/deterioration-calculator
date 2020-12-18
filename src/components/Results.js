import { mortality, scoreColors } from "../data/data";
import BothScoresPlot from "./BothScoresPlot";

const round = (num) => Math.round((num + Number.EPSILON) * 1) / 1;

export const Results = ({
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
