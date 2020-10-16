import { scaleLinear } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";
import { mean } from "d3-array";

import { bothScoresData } from "./BothScoresData";

import { allScores, mortality } from "./data";

const subplotHeight = 20;
const padding = 5;
const height = 21 * subplotHeight + 21 * padding;

const xAxisY = height + subplotHeight + 10;
const xAxisLabelSpacing = 70;

const paddingLeft = 70;
const paddingTop = 100;

const densityPlotWidth = 300;
const barChartSubPlotWidth = 50;
const mortalitySubPlotWidth = 100;

const textHeight = 20; // TODO - refactor out

const highlightColor = "#ffc200";

const scoreToY = (i) => {
  const row = 21 - i;
  return row * subplotHeight + (row - 1) * padding + subplotHeight / 4;
};

const round = (num) => Math.round((num + Number.EPSILON) * 10) / 10;

const XAxis = ({ x, ticks }) => {
  if (!ticks) {
    ticks = x.ticks(6);
  }

  const tickHeight = 10;
  const topPadding = 14;

  return (
    <g>
      <line
        x1={x(ticks[0])}
        x2={x(ticks.slice(-1)[0])}
        y1={0}
        y2={0}
        stroke="black"
        stroke-width="1px"
      />
      {ticks.map((t) => (
        <text
          x={x(t)}
          y={+tickHeight + topPadding}
          style={{ textAnchor: "middle" }}
          key={t}
        >
          {t}
        </text>
      ))}
      {ticks.map((t) => (
        <line
          x1={x(t)}
          x2={x(t)}
          y1={0}
          y2={+tickHeight}
          stroke="black"
          stroke-width="2px"
          key={t}
        />
      ))}
    </g>
  );
};

const BothScoresPlot = ({ mortalityScore, morbidityScore }) => {
  const svgWidth =
    densityPlotWidth +
    2 * paddingLeft +
    3 * padding +
    barChartSubPlotWidth +
    mortalitySubPlotWidth +
    80;

  const svgHeight = height + 40 + 40 + 25 + 30 + paddingTop;

  return (
    <svg width="500" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
      <g transform={`translate(${paddingLeft}, 0)`}>
        <Header />
      </g>

      <g transform={`translate(${paddingLeft}, 5)`}>
        <g transform={`translate(${0}, ${paddingTop})`}>
          <MortalitySubPlot mortalityScore={mortalityScore} />
        </g>

        <g
          transform={`translate(${mortalitySubPlotWidth}, ${
            paddingTop + subplotHeight / 4
          })`}
        >
          <BarChartSubPlot
            data={bothScoresData}
            mortalityScore={mortalityScore}
          />
        </g>

        <g
          transform={`translate(${
            mortalitySubPlotWidth + padding + 35 + barChartSubPlotWidth
          }, ${paddingTop})`}
        >
          <DensitySubPlots
            morbidityScore={morbidityScore}
            mortalityScore={mortalityScore}
          />
        </g>
      </g>
    </svg>
  );
};

const Header = () => {
  return (
    <>
      {/*
        <text x={mortalitySubPlotWidth + padding + barChartSubPlotWidth} y={15}>
          Mortality score
        </text>
        */}

      <text
        transform={`translate(${
          mortalitySubPlotWidth / 2
        }, ${paddingTop})rotate(315)`}
      >
        Mortality
      </text>

      <text
        transform={`translate(${
          mortalitySubPlotWidth + padding + barChartSubPlotWidth / 2
        }, ${paddingTop})rotate(315)`}
      >
        Number of patients
      </text>

      <text
        transform={`translate(${
          mortalitySubPlotWidth + padding + barChartSubPlotWidth + 20
        }, ${paddingTop})rotate(315)`}
      >
        4C Mortality score
      </text>

      <text
        transform={`translate(${
          mortalitySubPlotWidth +
          2 * padding +
          barChartSubPlotWidth +
          20 +
          densityPlotWidth / 2
        }, ${paddingTop})rotate(315)`}
      >
        Deterioration
      </text>
    </>
  );
};

const DensitySubPlots = ({ morbidityScore, mortalityScore }) => {
  mortalityScore = mortalityScore ? mortalityScore : 10; // debugging

  morbidityScore = morbidityScore ? morbidityScore : 0.95; // debugging

  const x = scaleLinear().domain([0, 100]).range([0, densityPlotWidth]);

  return (
    <>
      {allScores.map((i) => {
        return (
          <DensitySubPlot
            i={i}
            x={x}
            data={bothScoresData.filter((d) => d["ISARIC_4C_Mortality"] === i)}
            mortalityScore={mortalityScore}
            morbidityScore={morbidityScore}
          />
        );
      })}

      {/* Vertical line highlighting morbidity percentage */}
      <line
        x1={x(100 * morbidityScore)}
        x2={x(100 * morbidityScore)}
        y1={scoreToY(mortalityScore) + subplotHeight}
        y2={xAxisY + xAxisLabelSpacing - 25}
        stroke="black"
        stroke-dasharray="2,2"
        stroke-width={2}
      />

      {/* Label with morbidity percentage */}
      <text
        x={x(100 * morbidityScore)}
        y={xAxisY + xAxisLabelSpacing}
        text-anchor={"middle"}
        font-size="2em"
        font-weight="bold"
      >
        {mortalityScore > 0 && <>{round(100 * morbidityScore)}% risk</>}
      </text>
      <text
        x={x(100 * morbidityScore)}
        y={xAxisY + xAxisLabelSpacing + textHeight}
        text-anchor={"middle"}
      >
        {mortalityScore > 0 && <>of deterioration</>}
      </text>

      <g transform={`translate(0, ${xAxisY})`}>
        <XAxis x={x} ticks={x.ticks(3)} />

        {/*
        <text
          x={densityPlotWidth / 2}
          y={xAxisLabelSpacing}
          text-anchor={"middle"}
        >
          Risk of deterioration/%
        </text>
        */}
      </g>
    </>
  );
};

/*

      </g>


 */

const MortalitySubPlot = ({ mortalityScore }) => {
  mortalityScore = mortalityScore ? mortalityScore : 1; // debugging

  const x = scaleLinear().domain([0, 100]).range([0, mortalitySubPlotWidth]);

  const l = line().curve(curveCatmullRom.alpha(0.5))(
    mortality.map((d, i) => [x(d), scoreToY(i)])
  );

  return (
    <>
      <g transform={`translate(0, ${subplotHeight / 2})`}>
        {/* Line chart line */}
        <path d={l} stroke="lightgrey" fill="none" />

        {/* Points on line */}
        {allScores.map((s) => (
          <circle
            cx={x(mortality[s])}
            cy={scoreToY(s)}
            r={s === mortalityScore ? 4 : 2}
            fill={s === mortalityScore ? "black" : "lightgrey"}
          />
        ))}

        {/* Vertical line - would go down to axis if y2={xAxisY - subplotHeight / 2} */}
        <line
          x1={x(mortality[mortalityScore])}
          x2={x(mortality[mortalityScore])}
          y1={scoreToY(mortalityScore)}
          y2={xAxisY + xAxisLabelSpacing - subplotHeight / 2 - 25}
          stroke="black"
          stroke-dasharray="2,2"
        />

        {/* Horizontal line */}
        <line
          x1={x(mortality[mortalityScore])}
          x2={mortalitySubPlotWidth + barChartSubPlotWidth}
          y1={scoreToY(mortalityScore)}
          y2={scoreToY(mortalityScore)}
          stroke="black"
          stroke-dasharray="2,2"
        />

        {/* Label above horizontal line */}
        {/*
        <text
          x={x(mortality[mortalityScore]) + 30}
          y={scoreToY(mortalityScore) - 5}
          text-anchor={"middle"}
        >
          {mortalityScore > 0 && <>{round(mortality[mortalityScore])}%</>}
        </text>
*/}

        {/* Label beside vertical line */}
        <text
          x={x(mortality[mortalityScore]) + 5}
          y={xAxisY + xAxisLabelSpacing - subplotHeight / 2}
          text-anchor={"middle"}
          font-size="2em"
          font-weight="bold"
        >
          {mortalityScore > 0 && <>{round(mortality[mortalityScore])}% risk</>}
        </text>
        <text
          x={x(mortality[mortalityScore]) + 5}
          y={xAxisY + xAxisLabelSpacing - subplotHeight / 2 + textHeight}
          text-anchor={"middle"}
        >
          {mortalityScore > 0 && <>of death</>}
        </text>
      </g>
      <g transform={`translate(0, ${xAxisY})`}>
        <XAxis x={x} ticks={x.ticks(3)} />

        {/*
        <text
          x={mortalitySubPlotWidth / 2}
          y={xAxisLabelSpacing}
          text-anchor={"middle"}
        >
          Risk of death/%
        </text>
        */}
      </g>
    </>
  );
};

const BarChartSubPlot = ({ data, mortalityScore }) => {
  const x = scaleLinear().domain([0, 850]).range([0, barChartSubPlotWidth]);

  return allScores.map((i) => {
    const width = x(data.filter((d) => d["ISARIC_4C_Mortality"] === i).length);
    return (
      <rect
        x={barChartSubPlotWidth - width}
        width={width}
        y={scoreToY(i)}
        height={subplotHeight / 2}
        fill={i === mortalityScore ? "black" : "lightgrey"}
      />
    );
  });
};

const DensitySubPlot = ({ i, data, mortalityScore, morbidityScore, x }) => {
  const y = scaleLinear().domain([0, 0.17]).range([subplotHeight, 0]);

  var kde = kernelDensityEstimator(epanechnikov(2), x.ticks(60));
  var density = kde(
    data.map(function (d) {
      return d["ISARIC_4C_Deterioration"];
    })
  );

  const l = line().curve(curveCatmullRom.alpha(0.5))(
    density.map((d, i) => [x(d[0]), y(d[1])])
  );

  return (
    <>
      <g transform={`translate(0, ${scoreToY(i)})`}>
        <text
          x={-10}
          y={subplotHeight / 2 + 5}
          style={{ "text-anchor": "end" }}
          font-weight={i === mortalityScore ? "bold" : "normal"}
        >
          {i}
        </text>

        {data.map((d) => (
          <line
            x1={x(d["ISARIC_4C_Deterioration"])}
            x2={x(d["ISARIC_4C_Deterioration"])}
            y1={subplotHeight}
            y2={subplotHeight + 3}
            stroke={"black"}
            stroke-width={1}
            opacity={0.15}
          />
        ))}

        {/*  <line x1={0} x2={0} y1={0} y2={subplotHeight} stroke="black" /> */}

        {/* Line highlighting morbidity score */}
        {mortalityScore === i && (
          <line
            x1={x(100 * morbidityScore)}
            x2={x(100 * morbidityScore)}
            y1={0}
            y2={subplotHeight}
            stroke={highlightColor}
            stroke-width={3}
          />
        )}

        <path
          d={l}
          stroke="lightgrey"
          fill={mortalityScore === i ? "black" : "lightgrey"}
        />
      </g>
    </>
  );
};

function kde(kernel, thresholds, data) {
  return thresholds.map((t) => [t, mean(data, (d) => kernel(t - d))]);
}

function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}

function epanechnikov(bandwidth) {
  return (x) =>
    Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0;
}

export default BothScoresPlot;
