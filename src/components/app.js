import { Component } from "preact";
import { useState } from "preact/hooks";
import { scaleLinear } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";

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
    name: "Glasgow Coma Scale",
  },
  urea: {
    scores: {
      "⩽7": 0,
      "7-14": 1,
      ">14": 3,
    },
    name: "Urea (mmol/L)",
  },
  crp: {
    scores: {
      "<50": 0,
      "50-99": 1,
      "⩾100": 2,
    },
    name: "CRP (mg/dl)",
  },
};

const categories = [
  { name: "Low", min: 0, max: 3, color: "#fee5d9", mortality: "1.2%" },
  { name: "Intermediate", min: 4, max: 8, color: "#fcae91", mortality: "9.9%" },
  { name: "High", min: 9, max: 14, color: "#fb6a4a", mortality: "31.4%" },
  { name: "Very High", min: 15, max: 21, color: "#cb181d", mortality: "61.5%" },
];

const counts = [
  160.3375527426158,
  329.11392405063265,
  485.23206751054835,
  645.5696202531644,
  759.4936708860757,
  759.4936708860757,
  919.8312236286918,
  1097.0464135021098,
  1308.0168776371306,
  1620.2531645569622,
  1864.9789029535864,
  2050.6329113924053,
  2185.654008438818,
  2118.143459915612,
  1780.5907172995778,
  1455.6962025316454,
  1109.7046413502107,
  725.7383966244723,
  455.6962025316453,
  223.62869198312228,
  101.26582278481014,
  33.755274261603375,
];

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

const RiskStripChart = ({ score, rectHeight, marginLeft }) => {
  const x = (i) => 20 * i;
  const tickHeight = 6;

  return (
    <>
      {/* Label below risk bars */}
      <g transform={`translate(${marginLeft},5)`}>
        <text
          x={10 - marginLeft}
          y={rectHeight + 60}
          text-anchor="start"
          font-weight="bold"
        >
          Risk
        </text>

        {categories.map((c) => (
          <text
            x={(x(c.min) + x(c.max)) / 2}
            y={rectHeight + 60}
            text-anchor="middle"
            font-weight={score >= c.min && score <= c.max ? "bold" : "normal"}
          >
            {c.name}
          </text>
        ))}
      </g>

      <g transform={`translate(${marginLeft},30)`}>
        <text
          x={10 - marginLeft}
          y={rectHeight + 60}
          text-anchor="start"
          font-weight="bold"
        >
          Mortality
        </text>

        {categories.map((c) => (
          <text
            x={(x(c.min) + x(c.max)) / 2}
            y={rectHeight + 60}
            text-anchor="middle"
          >
            {c.mortality}
          </text>
        ))}
      </g>

      <g transform={`translate(${marginLeft},25)`}>
        {/* A bar for each risk category */}
        {categories.map((c) => (
          <rect
            x={x(c.min)}
            width={x(c.max) - x(c.min)}
            y={0}
            height={rectHeight}
            fill={c.color}
          />
        ))}

        {/* Vertical line for each value */}
        {allScores.map((s) => {
          return (
            <line x1={x(s)} x2={x(s)} y1={0} y2={rectHeight} stroke="grey" />
          );
        })}

        {/* label lower limit of each risk category */}
        {categories.map((c) => (
          <text x={x(c.min)} y={rectHeight + 20} text-anchor="middle">
            {c.min}
          </text>
        ))}
        {categories.map((c) => (
          <line
            x1={x(c.min)}
            x2={x(c.min)}
            y1={rectHeight}
            y2={rectHeight + tickHeight}
            stroke="black"
          />
        ))}

        {/* label upper limit of each risk category */}
        {categories.map((c) => (
          <text x={x(c.max)} y={rectHeight + 20} text-anchor="middle">
            {c.max}
          </text>
        ))}
        {categories.map((c) => (
          <line
            x1={x(c.max)}
            x2={x(c.max)}
            y1={rectHeight}
            y2={rectHeight + tickHeight}
            stroke="black"
          />
        ))}

        {/* Marker for calculated score */}
        <circle cy={10} cx={x(score)} r={5} fill="black" />
      </g>
    </>
  );
};

const RiskBar = ({ score, maxBarHeight, marginLeft }) => {
  const maxCount = Math.max.apply(Math, mortality);
  const y = scaleLinear().range([maxBarHeight, 0]).domain([0, maxCount]);

  const x = (i) => 20 * i;
  const barWidth = 8;

  return (
    <g>
      <g transform={`translate(${marginLeft},0)`}>
        <YAxis y={y} />
      </g>

      <g transform={`translate(${marginLeft},0)`}>
        {mortality.map((n, i) => (
          <rect
            x={x(i) - barWidth / 2}
            width={barWidth}
            y={y(n)}
            height={maxBarHeight - y(n)}
            fill={scoreColors[i]}
            opacity={i === score ? 1.0 : 0.4}
          />
        ))}

        <text text-anchor="start" transform={`translate(${15}, 0)rotate(90)`}>
          In-hospital mortality/%
        </text>
      </g>
    </g>
  );
};

/*
    const l = line()(survival.map((d, i) => [x(i), y(d)]));

    return <svg width="500" height="500">
        <g transform="translate(40,0)"><YAxis y={y}/></g>

        <g transform="translate(40,0)">
            <path d={l} stroke="red" fill="none"/>
            <line x1={x(score)} x2={x(score)} y1={y(0)} y2={y(100)} stroke="black"/>
        </g>

*/
const Risk = ({ score, maxBarHeight, marginLeft }) => {
  const maxCount = Math.max.apply(Math, mortality);
  const y = scaleLinear().range([maxBarHeight, 0]).domain([0, maxCount]);

  const x = (i) => 20 * i;

  const l = line().curve(curveCatmullRom.alpha(0.5))(
    mortality.map((d, i) => [x(i), y(d)])
  );

  return (
    <g>
      <g transform={`translate(${marginLeft},0)`}>
        <YAxis y={y} ticks={[0, 20, 40, 60, 80, 100]} />
      </g>

      <g transform={`translate(${marginLeft},0)`}>
        <path d={l} stroke="lightgrey" fill="none" />
        <circle cx={x(score)} cy={y(mortality[score])} r={4} fill="black" />
        <line
          x1={x(0)}
          x2={x(score)}
          y1={y(mortality[score])}
          y2={y(mortality[score])}
          stroke="black"
          stroke-dasharray="2,2"
        />
        <line
          x1={x(score)}
          x2={x(score)}
          y1={y(0) + maxBarHeight + 60}
          y2={y(mortality[score])}
          stroke="black"
          stroke-dasharray="2,2"
        />

        <text text-anchor="start" transform={`translate(${15}, 0)rotate(90)`}>
          In-hospital mortality/%
        </text>
      </g>
    </g>
  );
};

const FrequencyPlot = ({ score, maxBarHeight, marginLeft }) => {
  const maxCount = Math.max.apply(Math, counts);
  const y = scaleLinear().range([maxBarHeight, 0]).domain([0, maxCount]);

  const x = (i) => 20 * i;
  const barWidth = 8;

  return (
    <>
      <g transform={`translate(${marginLeft},0)`}>
        <YAxis y={y} />
      </g>
      <g transform={`translate(${marginLeft},0)`}>
        {counts.map((n, i) => (
          <rect
            x={x(i) - barWidth / 2}
            width={barWidth}
            y={y(n)}
            height={maxBarHeight - y(n)}
            fill={"grey"}
            opacity={i === score ? 1.0 : 0.4}
          />
        ))}

        <text text-anchor="start" transform={`translate(${15}, 0)rotate(90)`}>
          Number of patient in study
        </text>
      </g>
    </>
  );
};

const CombinedRiskPlot = ({ score }) => {
  const maxBarHeight = 250;
  const rectHeight = 20;
  const padding = 20;

  const marginLeft = 80;

  const svgHeight =
    maxBarHeight + 5 + 20 + 20 + 30 + rectHeight + maxBarHeight + 60 + 10 + 20;

  return (
    <div style={{ "max-width": "100%" }}>
      <svg viewBox={`0 0 500 ${svgHeight}`}>
        <g transform={"translate(0,50)"}>
          <Risk
            score={score}
            maxBarHeight={maxBarHeight}
            marginLeft={marginLeft}
          />

          <g transform={`translate(0, ${maxBarHeight + padding})`}>
            <FrequencyPlot
              score={score}
              maxBarHeight={maxBarHeight}
              marginLeft={marginLeft}
            />
          </g>

          <g
            transform={`translate(0, ${maxBarHeight + maxBarHeight + padding})`}
          >
            <RiskStripChart
              score={score}
              rectHeight={rectHeight}
              marginLeft={marginLeft}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

const YAxis = ({ y, ticks }) => {
  if (!ticks) {
    ticks = y.ticks(6);
  }

  const tickHeight = 10;
  const topPadding = 14;
  const textWidth = 20;

  return (
    <g>
      <line
        y1={y(ticks[0])}
        y2={y(ticks.slice(-1)[0])}
        x1={0}
        x2={0}
        stroke="black"
        stroke-width="1px"
      />
      {ticks.map((t) => (
        <text
          y={y(t)}
          x={-tickHeight + topPadding - textWidth}
          style={{ textAnchor: "end" }}
          key={t}
        >
          {t}
        </text>
      ))}
      {ticks.map((t) => (
        <line
          y1={y(t)}
          y2={y(t)}
          x1={0}
          x2={-tickHeight}
          stroke="black"
          stroke-width="2px"
          key={t}
        />
      ))}
    </g>
  );
};

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
        <h1>4C Mortality Score</h1>

        <p>
          The 4C Mortality Score is a risk stratification score that predicts
          in-hospital mortality for hospitalised COVID-19 patients, produced by
          the <a href="https://isaric4c.net/">ISARIC 4C consortium</a>.
        </p>
        <p>It is intended for use by clinicians.</p>
        <p>
          It is designed to be easy-to-use, and require only parameters that are
          commonly available at hospital presentation.
        </p>
        <p>
          For full details, see{" "}
          <a href="https://www.medrxiv.org/content/10.1101/2020.07.30.20165464v1#disqus_thread">
            the paper
          </a>
          .
        </p>

        {scores_array.map((f, i) => {
          const short_name = short_names[i];
          return (
            <>
              <label for={short_name}>
                {f.name}: {details(f)}
              </label>

              <div id={short_name} role="group" class="btn-group">
                {Object.keys(f.scores).map((value) => (
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
            <p>
              Mortality estimates include only in-hospital mortality, and are
              based on observed mortality among hospitalised COVID19 patients
              recruited into the ISARIC 4C study.
            </p>
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
