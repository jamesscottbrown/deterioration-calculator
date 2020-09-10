import { Component } from "preact";
import { useState } from "preact/hooks";
import CombinedRiskPlot from "./CombinedRiskPlot";

import { score_table, scoreColors } from "./data";

export default class App extends Component {
  /** Gets fired when the route changes.
   *    @param {Object} event        "change" event from [preact-router](http://git.io/preact-router)
   *    @param {string} event.url    The newly routed URL
   */
  handleRoute = (e) => {
    this.currentUrl = e.url;
  };

  render() {
    const [selection, setSelection] = useState({});

    const short_names = Object.keys(score_table);
    const scores_array = short_names.map((f) => score_table[f]);

    let score = 0;
    if (Object.keys(selection).length < scores_array.length) {
      score = null;
      console.log("Score not set");
    } else {
      for (let i in scores_array) {
        const short_name = short_names[i];
        const selectedValue = selection[short_name];
        score += score_table[short_name]["scores"][selectedValue];
      }
    }

    const details = (f) =>
      f.help && (
        <details>
          <summary>Definition</summary>
          {f.help}
        </details>
      );

    return (
      <div id="app">
        <base target="_parent" />

        <h1>4C Mortality Score</h1>

        <p>
          The 4C Mortality Score is a risk stratification score that predicts
          in-hospital mortality for hospitalised COVID-19 patients, produced by
          the <a href="https://isaric4c.net/">ISARIC 4C consortium</a>.{" "}
          <b>It is intended for use by clinicians.</b>
        </p>

        <p>
          It is designed to be easy-to-use, and require only parameters that are
          commonly available at hospital presentation.
        </p>

        <p>
          For full details, see{" "}
          <a href="https://doi.org/10.1136/bmj.m3339"> the paper</a> introducing
          the score.
        </p>
        <p>
          This is an infographic that visualises risk, based on observed
          mortality among hospitalised adult COVID19 patients recruited into the
          ISARIC 4C study in the UK.
        </p>

        {scores_array.map((f, i) => {
          const short_name = short_names[i];
          const values = f.order ? f.order : Object.keys(f.scores);

          return (
            <>
              <label for={short_name}>
                {f.name}: {details(f)}
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
                      setSelection({ ...selection, [short_name]: value })
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </>
          );
        })}

        {score !== null ? (
          <>
            <p
              class="centered"
              style={{ border: `solid 4px ${scoreColors[score]}` }}
            >
              <span
                style={{
                  fontSize: "4em",
                }}
              >
                <b>{score}</b>/21
              </span>{" "}
              <br />
              (higher is worse)
            </p>
            <CombinedRiskPlot score={score} />
          </>
        ) : (
          <p>
            <b>
              Please select a value for every variable to calculate a mortality
              score.
            </b>
          </p>
        )}

        <br />
        <div>
          <h2>What you should do</h2>
          <p>
            It is important that <i>everyone</i> follows the Government's advice
            on{" "}
            <a href="https://www.gov.uk/government/publications/staying-alert-and-safe-social-distancing">
              Staying alert and safe (social distancing)
            </a>
            , and on{" "}
            <a href="https://www.gov.uk/government/publications/covid-19-stay-at-home-guidance">
              self-isolating
            </a>{" "}
            if they or someone in their household has symptoms of COVID-19. This
            is important not only to protect yourself, but also to prevent you
            from accidentally infecting more vulnerable people.
          </p>

          <p>
            People who are defined as extremely vulnerable on medical grounds
            should also follow the government's{" "}
            <a href="https://www.gov.uk/government/publications/guidance-on-shielding-and-protecting-extremely-vulnerable-persons-from-covid-19">
              advice on shielding
            </a>
            .
          </p>

          <p>
            If you think that you might have COVID-19, you should stay at home
            and consult the{" "}
            <a href="https://www.nhs.uk/conditions/coronavirus-covid-19/check-if-you-have-coronavirus-symptoms/">
              NHS Website
            </a>{" "}
            for advice.
          </p>
        </div>
      </div>
    );
  }
}
