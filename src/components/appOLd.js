import {h, Component} from 'preact';
import {useState} from "preact/hooks";


const score_table = {

    'Age (years)': {
        '<50': 0,
        '50-59': 2,
        '60-69': 4,
        '70-79': 6,
        '>=80': 7
    },

    'Sex at birth': {
        'Female': 0,
        'Male': 1
    },

    'Number of comorbidities': {
        '0': 0,
        '1': 1,
        '>=2': 2
    },

    'Respiratory rate (breaths/minutes)': {
        '<20': 0,
        '20-29': 1,
        '>=30': 2
    },

    'Peripheral oxygen saturation on room air (%)': {
        '>=92': 0,
        '<92': 2
    },

    'Glasgow Coma Scale': {
        '15': 0,
        '<15': 2
    },

    'Urea (mmol/L)': {
        '<=7': 0,
        '7-14': 1,
        '>14': 3
    },

    'CRP (mg/dl)': {
        '<50': 0,
        '50-99': 1,
        '>=100': 2
    }
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

        const sanitiseName = name => name.replace(/ /g, '').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '');

        const measurements = Object.keys(score_table);
        const fields = measurements.map(f => ({scores: {...score_table[f]}, name: f}));


        console.log(fields);


        let score=0;
        if (Object.keys(selection).length < measurements.length){
            score = null;
        } else {
            for (let i in measurements){
                const field = measurements[i];
                const selectedValue = selection[sanitiseName(field)];
                score += score_table[field][selectedValue];
            }
            score = measurements.map(f => sanitiseName(f)).map(field => score_table[field][selection[field]])
        }

        console.log(score)


        return (
            <div id="app">
                <h1>Prognostic risk calculator</h1>

                {fields.map(measurement => {

                    const name = sanitiseName(measurement.name);

                    return <>
                        <label for={name}>{measurement.name}</label>
                        <div id={name} role="group" class="btn-group">
                            {Object.keys(measurement.scores).map(value =>
                                <button
                                    class={selection[name] === value ? "btn btn-secondary" : "btn btn-outline-secondary"}
                                    onclick={() => setSelection({...selection, [name]: value})}
                                >
                                    {value}
                                </button>)}
                        </div>
                    </>
                }
                )}

            </div>
        );
    }
}
