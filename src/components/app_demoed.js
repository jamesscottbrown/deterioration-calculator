import {h, Component} from 'preact';
import {useState} from "preact/hooks";
import {scaleLinear} from "d3-scale";
import {line} from "d3-shape";

const score_table = {
    age: {
        "scores":
            {
                "<50":
                    0,
                "50-59":
                    2,
                "60-69":
                    4,
                "70-79":
                    6,
                "⩾80":
                    7
            }
        ,
        "name":
            "Age (years)"
    }
    ,
    sex: {
        "scores":
            {
                "Female":
                    0,
                "Male":
                    1
            }
        ,
        "name":
            "Sex at birth"
    }
    ,
    comorbidities: {
        "scores":
            {
                "0":
                    0,
                "1":
                    1,
                "⩾2":
                    2
            }
        ,
        "name":
            "Number of comorbidities"
    }
    ,
    respiratory_rate: {
        "scores":
            {
                "<20":
                    0,
                "20-29":
                    1,
                "⩾30":
                    2
            }
        ,
        "name":
            "Respiratory rate (breaths/minutes)"
    }
    ,
    oxygen_saturation: {
        "scores":
            {
                "<92":
                    2,
                "⩾92":
                    0,
            }
        ,
        "name":
            "Peripheral oxygen saturation on room air (%)"
    }
    ,
    gcs: {
        "scores":
            {
                "<15":
                    2,
                "15":
                    0
            }
        ,
        "name":
            "Glasgow Coma Scale"
    }
    ,
    urea: {
        "scores":
            {
                "⩽7":
                    0,
                "7-14":
                    1,
                ">14":
                    3
            }
        ,
        "name":
            "Urea (mmol/L)"
    }
    ,
    crp: {
        "scores":
            {
                "<50":
                    0,
                "50-99":
                    1,
                "⩾100":
                    2
            }
        ,
        "name":
            "CRP (mg/dl)"
    }
};


const categories = [
    {name: "Low", min: 0, max: 3, color: "#fee5d9"},
    {name: "Intermediate", min: 4, max: 8, color: "#fcae91"},
    {name: "High", min: 9, max: 14, color: "#fb6a4a"},
    {name: "Very High", min: 15, max: 21, color: "#cb181d"}
];

const counts = [160.3375527426158,
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




const allScores = Array.apply(null, Array(21 + 1)).map((_, i) => i);

let scoreColors = [];
for (let j in categories) {
    const cat = categories[j];
    for (let i = cat.min; i <= cat.max; i++) {
        scoreColors[i] = cat.color;
    }
}


const ResultsChart = ({score, rectHeight}) => {
    const x = i => 20 * i;
    const tickHeight = 6;

    return <>

        {/* Label below risk bars */}
        <g transform={"translate(60,5)"}>
            <text x={10 - 60} y={rectHeight + 60} text-anchor="start" font-weight="bold">Risk</text>

            {categories.map(c => <text x={(x(c.min) + x(c.max)) / 2} y={rectHeight + 60}
                                       text-anchor="middle">{c.name}</text>)}
        </g>

        <g transform={"translate(60,25)"}>

            {/* A bar for each risk category */}
            {categories.map(c => <rect x={x(c.min)} width={x(c.max) - x(c.min)} y={0}
                                       height={rectHeight} fill={c.color}/>)}

            {/* Vertical line for each value */}
            {allScores.map(s => {
                return <line x1={x(s)} x2={x(s)} y1={0} y2={rectHeight} stroke="lightgrey"/>
            })}


            {/* label lower limit of each risk category */}
            {categories.map(c => <text x={x(c.min)} y={rectHeight + 20}
                                       text-anchor="middle">{c.min}</text>)}
            {categories.map(c => <line x1={x(c.min)} x2={x(c.min)} y1={rectHeight}
                                       y2={rectHeight + tickHeight} stroke="black"/>)}

           {/* label upper limit of each risk category */}
            {categories.map(c => <text x={x(c.max)} y={rectHeight + 20}
                                       text-anchor="middle">{c.max}</text>)}
            {categories.map(c => <line x1={x(c.max)} x2={x(c.max)} y1={rectHeight}
                                       y2={rectHeight + tickHeight} stroke="black"/>)}

            {/* Marker for calculated score */}
            <circle cy={10} cx={x(score)} r={5} fill="black" />
        </g>
    </>
};


const Histogram = ({score}) => {
    const maxBarHeight = 250;
    
    const maxCount = Math.max.apply(Math, counts);
    const y = scaleLinear().range([maxBarHeight, 0]).domain([0, maxCount])

    const x = i => 20 * i;
    const barWidth=8, rectHeight=20;

    return <svg width="500" height={maxBarHeight + 5 + 20 + 20 + 30 + rectHeight}>

                <g transform="translate(60,0)"><YAxis y={y}/></g>

        <g transform={"translate(60,0)"}>
            {counts.map((n, i) => <rect x={x(i) - barWidth/2} width={barWidth} y={y(n)} height={maxBarHeight - y(n)}
                                        fill={i === score ? "black" : scoreColors[i]}
                                        opacity={i === score ? 1.0 : 0.4}/>)}

                                        <text text-anchor="start"  transform={`translate(${15}, 0)rotate(90)`}>Number of patient in study</text>
        </g>

        <g transform={`translate(0, ${maxBarHeight})`}>
            <ResultsChart score={score} rectHeight={rectHeight} />
        </g>
    </svg>
}


const YAxis = ({y}) => {
    const ticks = y.ticks(6);
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
                    style={{textAnchor: 'end'}}
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
    handleRoute = e => {
        this.currentUrl = e.url;
    };


    render() {

        const [selection, setSelection] = useState({});

        const short_names = Object.keys(score_table);
        const scores_array = short_names.map(f => score_table[f]);


        let score = 0;
        if (Object.keys(selection).length < scores_array.length) {
            score = null;
            console.log("Score not set");
        } else {
            for (let i in scores_array) {
                const short_name = short_names[i];
                const selectedValue = selection[short_name];
                score += score_table[short_name]['scores'][selectedValue];
            }
        }

        return (
            <div id="app">
                <h1>4C Mortality Score</h1>

                <p>The 4C Mortality Score is a risk stratification score that predicts in-hospital mortality for
                    hospitalised COVID-19 patients, produced by the <a href="https://isaric4c.net/">ISARIC 4C
                        consortium</a>.</p>
                <p>It is designed to be easy-to-use, and require only parameters that are commonly available at hospital
                    presentation.</p>
                <p>For full details, see <b>the paper</b>.</p>

                {scores_array.map((f, i) => {
                        const short_name = short_names[i];
                        return <>
                            <label for={short_name}>{f.name}: </label>
                            <div id={short_name} role="group" class="btn-group">
                                {Object.keys(f.scores).map(value =>
                                    <button
                                        class={selection[short_name] === value ? "btn btn-secondary" : "btn btn-outline-secondary"}
                                        onclick={() => setSelection({...selection, [short_name]: value})}
                                    >
                                        {value}
                                    </button>)}
                            </div>
                        </>
                    }
                )}

                {(score !== null) ? <>
                        <p><span style={{fontSize: "2em"}}><b>{score}</b>/21</span> (higher is worse).
                        </p>
                        <Histogram score={score}/>
                    </> :
                    <p><b>Please select an option for every variable to calculate a mortality score.</b></p>
                }

            </div>
        );
    }
}
