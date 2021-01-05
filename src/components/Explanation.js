import { mortality } from "../data/data";

const round = (num) => Math.round((num + Number.EPSILON) * 1) / 1;

export const Explanation = ({ short_names }) => (
  <>
    <details style={{ border: "1px solid lightgrey", "border-radius": "5px" }}>
      <summary>How the Mortality calculation is done</summary>
      <p>
        The calculation is simple, and can be done without even requiring a
        calculator.
      </p>
      <p>
        The ISARIC4C score is obtained by adding the scores for each individual
        variable (see Table 2 of{" "}
        <a href="https://doi.org/10.1136/bmj.m3339">
          {" "}
          the mortality model paper
        </a>
        ). The contributions to the total score are listed on each button in the
        form below.
      </p>

      <p>
        The observed in-hospital mortality for patients with this score in the
        validation cohort is then given by a lookup table (see Figure 2 of{" "}
        <a href="https://doi.org/10.1136/bmj.m3339"> the paper</a>):
      </p>

      <table
        style={{
          "padding-bottom": "10px",
          margin: "auto",
          "text-align": "right",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                "border-bottom": "1px solid black",
              }}
            >
              4C Mortality Score
            </th>
            <th style={{ "border-bottom": "1px solid black" }}>Mortality/%</th>
          </tr>
        </thead>

        {mortality.slice(1).map((val, i) => (
          <tr style={{ background: i % 2 == 0 ? "white" : "#ebebeb" }}>
            <td>{i + 1}</td>
            <td>{round(val)}</td>
          </tr>
        ))}
      </table>
    </details>

    <br />

    <details style={{ border: "1px solid lightgrey", "border-radius": "5px" }}>
      <summary>How the Deterioration calculation is done</summary>
      <p>
        The full 4C Deterioration logistic regression equation presented in the
        deterioration model{" "}
        <a href="https://doi.org/10.1016/S2213-2600(20)30559-2">paper</a> was
        transformed to a points-based score to enable simple manual calculation.
      </p>
      <p>
        A points score is allocated for each predictor; scores are then summed
        for all predictors to derive the 'total points score' for the patient.
      </p>
      <p>
        The points score allocations for each predictor and the corresponding
        deterioration 'probability' allocated to that 'total points score' can
        be found in our{" "}
        <a href="./assets/4C_deterioration_look_up_tables_2020-12-09.xlsx">
          look-up tables
        </a>
        .
      </p>
    </details>
  </>
);
