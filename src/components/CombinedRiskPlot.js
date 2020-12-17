import { categories, counts, mortality, allScores } from "./data";
import { scaleLinear } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";

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

const Risk = ({ score, maxBarHeight, marginLeft }) => {
  const maxCount = Math.max.apply(Math, mortality);
  const y = scaleLinear().range([maxBarHeight, 0]).domain([0, maxCount]);

  const x = (i) => 20 * i;

  const l = line().curve(curveCatmullRom.alpha(0.5))(
    mortality.map((d, i) => [x(i), y(d)])
  );

  const round = (num) => Math.round((num + Number.EPSILON) * 1) / 1;

  return (
    <g>
      <g transform={`translate(${marginLeft},0)`}>
        <YAxis y={y} ticks={[0, 20, 40, 60, 80, 100]} />
      </g>

      <g transform={`translate(${marginLeft},0)`}>
        <path d={l} stroke="lightgrey" fill="none" />
        {allScores.map((s) => (
          <circle cx={x(s)} cy={y(mortality[s])} r={2} fill="lightgrey" />
        ))}

        <circle cx={x(score)} cy={y(mortality[score])} r={4} fill="black" />

        {/* Horizontal line */}
        <line
          x1={x(0)}
          x2={x(score)}
          y1={y(mortality[score])}
          y2={y(mortality[score])}
          stroke="black"
          stroke-dasharray="2,2"
        />

        {/* Vertical line */}
        <line
          x1={x(score)}
          x2={x(score)}
          y1={y(0) + maxBarHeight + 60}
          y2={y(mortality[score])}
          stroke="black"
          stroke-dasharray="2,2"
        />

        <text
          x={x(score) / 2}
          y={y(mortality[score]) - 5}
          text-anchor={"middle"}
        >
          {score > 0 && <>{round(mortality[score])}%</>}
        </text>

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
      <svg viewBox={`0 0 510 ${svgHeight}`}>
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

export default CombinedRiskPlot;
