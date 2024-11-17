import { SVG } from '../svg/default'; const svgInst = new SVG();
import { IndexedDB } from './IDB.js'; const _storage = new IndexedDB();
import { API } from './API.js'; const api = new API();
import { hazardRangeExt } from './levels.js';
// const segmentHeadline = (title, svg) => {
//     let c = `<div class="result-title-box">`
//     c += `<div class="result-box-icon">${svgInst.segments(svg)}</div>`
//     c += `<div class="result-title">${title}</div>`
//     c += `</div>`
//     return c
// }

const segmentHeadlineText = (title) => {
    let c = `<div class="result-title-box single">`
    c += `<div class='result-title'>${title}</div>`
    c += `</div>`
    return c
}

// const highlightWords = (text, type = 'conformity') => {

//     let highlightedString = ''
//     let tags
//     let escapedTags;
//     let regex;

//     switch (type) {

//         case "conformity":
//             tags = ["conformity", "non-conformity", "deviation", 'high', 'medium','low']; // Array of tags to highlight
//             escapedTags = tags.map(tag => tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
//             regex = new RegExp(`\\b(${escapedTags.join('|')})\\b`, 'gi');
//             let currentIndex = 0;
//             let match;

//             // Find all matches in the text
//             while ((match = regex.exec(text)) !== null) {
//                 const matchedWord = match[0];
//                 const tagIndex = tags.findIndex(tag => tag.toLowerCase() === matchedWord.toLowerCase());

//                 if (tagIndex !== -1) {
//                     const beforeText = text.substring(currentIndex, match.index);
//                     const highlightedWord = `<span class="highlight-audit ${tags[tagIndex]}">${matchedWord}</span>`;

//                     highlightedString += beforeText + highlightedWord;
//                     currentIndex = match.index + matchedWord.length;
//                 }
//             }

//             // Append remaining text after the last match
//             highlightedString += text.substring(currentIndex);
//             break;

//         default:
//             tags = [
//                 "waste",
//                 "debris",
//                 "wear",
//                 "environmental",
//                 "management",
//                 "water",
//                 "chemicals",
//                 "hazardous",
//                 "inspections",
//                 "compliance",
//                 "safety",
//                 "PPE",
//                 "spills",
//                 "leaks",
//                 "recycling",
//                 "pollution",
//                 "contamination",
//                 "disposal",
//                 "regulations",
//                 "ecology",
//                 "sustainability",
//                 "clean-up",
//                 "wastewater",
//                 "toxic",
//                 "hazard",
//                 "protection",
//                 "environment",
//                 "monitoring",
//                 "biodegradable",
//                 "reduction",
//                 "electrical equipment",
//                 "high-risk",
//                 "emergency stop",
//                 "fire extinguisher",
//                 "cluttered"
//             ];
//             // if (this.addtltag && Array.isArray(this.addtltag)) {
//             //     tags = [...tags, ...this.addtltag];
//             // }

//             escapedTags = tags.map(tag => tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
//             regex = new RegExp(`\\b(${escapedTags.join('|')})\\b`, 'gi');
//             highlightedString = text.replace(regex, '<span class="highlight">$&</span>');
//             break;
//     }

//     return highlightedString
// }

// const resultLiterals = {

//     compliance_mapping: (data) => {
//         console.log(data)
//         let c = segmentHeadline('Compliance Mapping', 'result_compliance')
//         data.map(a => {
//             const content = `${a.regulation} - ${a.clauses}`
//             c += `<div class='result-box-content'>${content}</div>`
//         })
//         c += `</div>`
//         return c
//     },
//     facilities: (data) => {
//         let c = segmentHeadline('Facility Register', 'result_facility')
//         data.map(a => {
//             const content = `${a.facility} - ${a.type}`
//             c += `<div class='result-box-content'>${content}</div>`
//         })
//         return c
//     },
//     risk_assessment: (data) => {
//         console.log(data.content)
//         const RA = data.content['Risk Evaluation']
//        // let c = segmentHeadline('Risk Evaluation', 'result_risk')
//         let c = segmentHeadlineText('Description')
//         if (data.content.Description) c += `<div class='result-box-content'>${highlightWords(data.content.Description, 'risks')}</div>`
//         c += segmentHeadlineText('Risk Evaluation')
//         RA.sort((a, b) => b.risk_rating - a.risk_rating)
//         .map(a => {
//             c += `<div class='result-box-content'>`
//             c += `<div>${a.hazard} (${a.type})</div>`
//             c += `<div>Risk Rating: ${a.risk_rating} (likelihood: ${a.likelihood} x severity: ${a.severity})</div>`
//             c += `</div>`
//         })
//         Object.keys(data).map(a => {
//             data[a.toLowerCase()] = data[a]
//             delete data[a]
//         })

//         if (data.context) {
//             c += segmentHeadlineText('Context')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.context}</div>`
//             c += `</div>`
//         }
//         // if (data.evidences) {
//         //     c += segmentHeadlineText('Evidences')
//         //     c += `<div class="results-segment-item">`
//         //     c += `<div class='result-box-content results-segment-item'>${data.evidences}</div>`
//         //     c += `</div>`
//         // }
//         if (data.executiontime) {
//             c += segmentHeadlineText('Execution Time')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.executiontime}</div>`
//             c += `</div>`
//         }
//         return c
//     },
//     risk_observation: (data) => {
//         console.log(data)
//         let c = segmentHeadline('Risk Observation', 'result_risk')
//         c += `<div class='result-box-content'>${highlightWords(data.Description, 'risks')}</div>`
//         data['Risk Scenarios'].map(a => {
//             c += `<div class='result-box-content loop'>`
//             c += `<div class="result-box-entry">Finding: ${a.Finding}</div>`
//             c += `<div class="result-box-entry">Risk Score: ${highlightWords(a['Risk Score']['Score'], 'conformity') } ${a['Risk Score']['Reason']}</div>`
//             c += `<div class="result-box-entry">Norm reference: ${a['Norm reference']}</div>`
//             c += `<div class="result-box-entry">Root Cause: ${a['Root Cause']}</div>`
//             c += `</div>`
//         })
//         return c
//     },

//     VDE_Details: (details) => {
//         let c = ''
//         Object.keys(details).some(detail => {
//             const content = details[detail]
//             if (content[0] === 'n/a') return
//             c += segmentHeadlineText(detail)
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content float'>`
//                 content
//                 .filter(c =>  c !== 'n/a')
//                 .some(segment => {
//                     c += `<div class='risk-tag _t'>${segment}</div>`
//                 })
//             c += `</div>`
//             c += `</div>`
//         })
//         return c
//     },
//     iso_compact: (data) => {

//         Object.keys(data).map(a => {
//             data[a.toLowerCase()] = data[a]
//             delete data[a]
//         })

//         let c = ''//segmentHeadline('VDE Assessment', 'vde')
//         if (data.description) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.description, 'risks')}</div>`

//         if (data.norm_references){
//         c += segmentHeadlineText('ISO Audit Assessment')
//             console.log(data.norm_references[0])
//             data.norm_references[0].Chapters.map(a => {
//             const auditquestion = `${a.Clause} - ${a.Title}`
//             c += `<div class='result-box-content r-h1'>${auditquestion}</div>`
//             c += `<div class='result-box-content'>${a.Auditquestion}</div>`
//             c += `<div class='result-box-content r-h2'>${highlightWords(a.Finding)}</div>`
//             })
//         c += `</div>`
//         }

//         if (data.context) {
//             c += segmentHeadlineText('Context')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.context}</div>`
//             c += `</div>`
//         }
//         if (data.evidences) {
//             c += segmentHeadlineText('Evidences')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.evidences}</div>`
//             c += `</div>`
//         }
//         if (data.executiontime) {
//             c += segmentHeadlineText('Execution Time')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.executiontime}</div>`
//             c += `</div>`
//         }
//         return c
//     },

//     vde: (data) => {

//         Object.keys(data).map(a => {
//             data[a.toLowerCase()] = data[a]
//             delete data[a]
//         })

//         let c = ''//segmentHeadline('VDE Assessment', 'vde')
//         if (data.description) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.description, 'risks')}</div>`

//         if (data.observations) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.observations.join(' '), 'risks')}</div>`
//         //if (data.details[0]) c += resultLiterals.VDE_Details(data.details[0])

//         if (data.findings) {
//             c += segmentHeadlineText('VDE Assessment')
//             data.findings
//                 .sort((a, b) => {
//                     if (a.assessment === 'true') return -1;
//                     if (b.assessment === 'true') return 1;
//                     if (a.assessment < b.assessment) return -1;
//                     if (a.assessment > b.assessment) return 1;
//                     return 0;
//                 })
//                 .map(({ assessment, explanation, question }) => {
//                     c += `<div class='result-box-assessment results-segment-item'>`
//                     c += `<div class='result-box-content loop'>`
//                     c += `<div class="result-title-mini">${question}</div>`
//                     c += `<div class="result-title-">${explanation}</div>`
//                     c += `</div>`
//                     const symbol = assessment === "true" ? 'check' : (assessment === "n/a" ? 'n_a' : 'uncheck')
//                     c += `<div class='checklist-svg'>${svgInst.assessments(symbol)}</div>`
//                     c += `</div>`
//                     c += `</div>`
//                 })
//         }

//         if (data.segmentation) {
//         c += segmentHeadlineText('Segmentation')
//         c += `<div class="results-segment-item">`
//         c += `<div class='result-box-content float'>`
//         data.segmentation.map(segment => {
//         c += `<div class='risk-tag'>${segment}</div>`
//         })
//         c += `</div>`
//         c += `</div>`
//         }

//         if (data.equipment) {
//             c += segmentHeadlineText('Equipment')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content float'>`
//             data.equipment.map(equipment => {
//                 c += `<div class='risk-tag'>${equipment}</div>`
//             })
//             c += `</div>`
//             c += `</div>`
//         }

//         if (data.protective_devices) {
//             c += segmentHeadlineText('Protective Devices')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content float'>`
//             data.protective_devices.map(protective_device => {
//                 c += `<div class='risk-tag'>${protective_device}</div>`
//             })
//             c += `</div>`
//             c += `</div>`
//         }

//         if (data.lables) {
//             c += segmentHeadlineText('Lables')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content float'>`
//             data.lables.map(lable => {
//                 c += `<div class='risk-tag'>${lable}</div>`
//             })
//             c += `</div>`
//             c += `</div>`
//         }

//         if (data.recommendations) {
//             c += segmentHeadlineText('Recommendations')
//             if (data.morephotosof) {
//                 c += `<div class="results-segment-item">`
//                 c += `<div class='result-box-content loop'>Take more Photos of: ${data.morephotosof.join(' ')}`
//                 c += `</div></div>`
//             }
//             data.recommendations.map(recommendation => {
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content loop'>${recommendation}`
//             c += `</div></div>`
//         })
//         }

//         if (data.executiontime) {
//             c += segmentHeadlineText('Execution Time')
//             c += `<div class="results-segment-item">`
//             c += `<div class='result-box-content results-segment-item'>${data.executiontime}</div>`
//             c += `</div>`
//         }

//         return c
//     }

// }

const hazardLevels = [
    { bck_color: "#4CAF50", range: [1, 6], action: "No action needed" },
    { bck_color: "#ffb833", range: [7, 12], action: "Monitor closely" },
    { bck_color: "#FF8C00", range: [13, 18], action: "Take preventive measures" },
    { bck_color: "#FF0000", range: [19, 24], action: "Implement immediate action" },
    { bck_color: "#8B00FF", range: [25, 25], action: "Immediate intervention necessary" }
];

const ISOLevels = [
    { bck_color: "#4CAF50", range: 1, action: "No action required", title: 'conformity', color: '#fff' },
    { bck_color: "#FF9800", range: 2, action: "Monitor closely", title: 'deviation', color: '#fff' },
    { bck_color: "#F44336", range: 3, action: "Take preventive actions", title: 'non-conformity', color: '#fff' }
];

const VDELevels = [
    { bck_color: "#ccc", range: 1, action: "Take better Photos", title: 'not assessable' },
    { bck_color: "#af2b16", range: 2, action: "Take preventive actions", title: 'non-conformity', color: '#fff' },
    { bck_color: "rgb(0, 90, 0)", range: 3, action: "No action required", title: 'conformity', color: '#fff' }
];

const statusBarRA = ({ sum, colors }) => {
 console.log({ sum, colors })
    let gradient = ''
    const clrArr = Object.keys(colors)
    let sumPerc = 0
    clrArr.map((color, i) => {
        const amount = colors[color]
        const percentage = (amount / sum) * 100
        sumPerc += percentage
        const last = sumPerc - percentage
        switch (true) {
            case i === clrArr.length - 1: //last
                gradient += `${color} ${last}% 100%`
                break;
            default:
                gradient += `${color} ${last}% ${sumPerc}%,`
                break;
        }
    })
    let s = `<div class="status-bar" style="background: linear-gradient(to right, ${gradient})">`
    s += `<div class="status-number" ${sum >= 10 ? 'style="font-size: x-small"' : ''}>${sum}</div></div>`
    return s
}

const getHazardColor = (number) => {
    for (let level of hazardLevels) {
        const [min, max] = level.range;
        if (number >= min && number <= max) {
            return level.bck_color; // Return color if number is in the range
        }
    }
    return null;
}

const getISOColor = (number) => {
    const level = ISOLevels.find(level => level.range === number);
    return level ? level.bck_color : null; // Return the bck_color or null if not found
}

const getVDEColor = (number) => {
    const level = VDELevels.find(level => level.range === number);
    return level ? level.bck_color : null; // Return the bck_color or null if not found
}

const gatherISOAssessment = (finding) => {
    const text = finding.toLowerCase();
    switch (true) {
        case /non[-\s]?conformity/.test(text):  // Changed this line
            return 3;
        case /\bconformity\b/.test(text):
            return 1;
        case /\bdeviation\b/.test(text):
            return 2;
    }
};

const gatherVDEAssessment = (finding) => {
    const text = finding.toLowerCase();
    switch (true) {
        case text === 'n/a':
            return 1;
        case text === 'false':  // Changed this line
            return 2;
        case text === 'true':
            return 3;
    }
};

    //Legend Separate

const summaryLiterals = {

    vde: async (data) => {
        let results = {}
        for (const { sha } of data) {
            const result = await api.imageResult(sha)
            const Findings = result.results[0].Findings
            Findings.map(r => {
                const { question, assessment } = r
                if (!results[question]) results[question] = {
                    findings: []
                }
                results[question].findings.push(gatherVDEAssessment(assessment))
            })
        }

        let c = segmentHeadlineText('VDE Assessment Overview')
        Object.keys(results).sort(a => { console.log(a) })
            .map(res => {
                const { findings } = results[res]
                const sum = findings.length
                const findingsSort = findings.sort((a, b) => a - b);
                const colors = {}
                findingsSort.map(a => {
                    const clr = getVDEColor(a)
                    if (!colors[clr]) colors[clr] = 0
                    colors[clr]++
                })
                c += `<div class='project-wrapper'>`
                c += `<div>${res}</div>`
                c += statusBarRA({ sum, colors })
                c += `</div>`
            })
        let vdeLvl = `<div class="summary-legend _element">`
        vdeLvl += segmentHeadlineText('Compliance Overview')
        vdeLvl += `<div class='results-segment-flex'>`
        VDELevels.map(a => {
            vdeLvl += `<div class='rsf-item' style="background-color: ${a.bck_color}; color: ${a.color}">`
            vdeLvl += `<div>${a.title}</div>`
            vdeLvl += `<div class="haz-lvl-action">${a.action}</div>`
            vdeLvl += `</div>`
        })
        vdeLvl += `</div>`
        return [c, vdeLvl]
    },
    iso_assessment: async (data) => {
        let results = {}

        for (const { sha } of data) {
            const result = await api.imageResult(sha)
            const chapters = result.results[0].Norm_References[0].Chapters
            chapters.map(c => {
                const clause = c.Clause
                if (!results[clause]) results[clause] = {
                    title: c.Title,
                    findings: []
                }
                results[clause].findings.push(gatherISOAssessment(c.Finding))
            })
        }

        let c = segmentHeadlineText('ISO Chapter Overview')
        Object.keys(results).sort()
            .map(res => {
                const { title, findings } = results[res]
                const sum = findings.length
                const findingsSort = findings.sort((a, b) => a - b);
                const colors = {}
                findingsSort.map(a => {
                    const clr = getISOColor(a)
                    if (!colors[clr]) colors[clr] = 0
                    colors[clr]++
                })
                c += `<div class='project-wrapper'>`
                c += `<div>${res} - ${title}</div>`
                c += statusBarRA({ sum, colors })
                c += `</div>`
            })

        let isoLvl = `<div class="summary-legend">`
        isoLvl += segmentHeadlineText('Compliance Overview')
        isoLvl += `<div class='results-segment-flex'>`
        ISOLevels.map(a => {
            isoLvl += `<div class='rsf-item' style="background-color: ${a.bck_color}; color: ${a.color}">`
            isoLvl += `<div>${a.title}</div>`
            isoLvl += `<div class="haz-lvl-action">${a.action}</div>`
            isoLvl += `</div>`
        })
        isoLvl += `</div>`

        return [c, isoLvl]
    },
    risk_assessment: async (data) => {
        let legend = `<div class="summary-legend">`
        // legend += segmentHeadlineText('Compliance Overview')
        legend += `<div class='results-segment-flex'>`
        hazardRangeExt().map(a => {
            const uniqueRange = new Set(a.range)
            const joinedRange = [...uniqueRange].join(' - ');
            legend += `<div class='rsf-item'>`
            legend += `<div class='rsf-item-text' style="background-color: ${a.bck_color}; color: ${a.font_color}">${joinedRange}</div>`
            legend += `<div class="haz-lvl-action">${a.action}</div>`
            legend += `</div>`
        })
        legend += `</div>`
        const hazards = {}
        const results = []

        for (const { sha } of data) {
            const result = await api.imageResult(sha)
            results.push(result)
        }
        
        results
        .filter(f => f.results.length > 0)
        .map(a => {
            const ra = a.results[0].content['Risk Evaluation']
            const raRes = {}
            ra.map(r => {
                //PCB Specific to Checklist !!!!!!!!!!!!!!
                //TYPE = AREA
                const type = r.area ||r.type
                if (!raRes[type]) raRes[type] = []
                raRes[type].push(r.risk_rating)
            })

            Object.keys(raRes).map(type => {
                const numbers = raRes[type]
                const highest = Math.max(...numbers);
                const outType = type//.replace('Hazards related to ', '')
                if (!hazards[outType]) hazards[outType] = []
                hazards[outType].push(highest)
                //const avg = Math.round(numbers.reduce((sum, value) => sum + value, 0) / numbers.length);
            })
        })

        let projects = []

        let c = ''//segmentHeadlineText('Hazards Overview')
        Object.keys(hazards)
            .map(hazard => ({ hazard, arr: hazards[hazard] }))  // Map each key to an object with the array
            .sort((a, b) => {
                const maxA = Math.max(...a.arr);
                const maxB = Math.max(...b.arr);

                if (maxA !== maxB) {
                    return maxB - maxA; // Sort by the highest value in descending order
                } else {
                    const countA = a.arr.filter(num => num === maxA).length;
                    const countB = b.arr.filter(num => num === maxB).length;
                    return countB - countA; // Sort by count of highest value if highest values are the same
                }
            })
            .forEach(({ hazard, arr }) => {
                const sum = arr.length;
                const arrSort = arr.slice().sort((a, b) => a - b);// Sort the individual array in ascending order
                const colors = {};
                arrSort.forEach(value => {
                    const clr = getHazardColor(value);
                    colors[clr] = (colors[clr] || 0) + 1;
                });

                // c += `<div class='project-wrapper'>`;
                // c += `<div>${hazard}</div>`;
                // c += statusBarRA({ sum, colors });
                // c += `</div>`;
                // //projects.push(c)
                projects.push({ status: statusBarRA({ sum, colors }), hazard } )
            });
        
        return { projects, legend }
    }
}

// const sortRAArray = () => {
//     arrays.sort((a, b) => {
//         const maxA = Math.max(...a);
//         const maxB = Math.max(...b);

//         if (maxA !== maxB) {
//             return maxB - maxA; // Sort by the highest value in descending order
//         } else {
//             // If highest values are the same, sort by the count of the highest value in descending order
//             const countA = a.filter(num => num === maxA).length;
//             const countB = b.filter(num => num === maxB).length;
//             return countB - countA;
//         }
//     });
// }

export class SummaryRenderer {

    output = async (entry) => {
        return new Promise(async (resolve, reject) => {//Reject!!!
        const { project } = entry

           const projectData = await api.projectResults(project)
            const assessment = 'risk_assessment'
            resolve(await summaryLiterals[assessment](projectData))


            // const { assessment, title } = await api.getProject(project)
            // const { data } = await _storage.getData({ value: title, field: 'project' })
            // console.log(data)
            //resolve(summaryLiterals[assessment] ? summaryLiterals[assessment](projectData) : [])
        })
    }
}