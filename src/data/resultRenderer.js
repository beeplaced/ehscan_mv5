import { SVG } from '../svg/default'
const svgInst = new SVG();
import { getHazardRangeColor } from './levels.js';

const convertFromZulu = (dateString) => {
    try {
        const date = new Date(dateString)
        const day = date.getUTCDate()
        const month = date.getUTCMonth() + 1
        const year = date.getUTCFullYear()
        const dayFormatted = ('0' + day).slice(-2)
        const monthFormatted = ('0' + month).slice(-2)
        // switch (this.country) {
        //     case 'us':
        //         break;
        //     default: //de
                return `${dayFormatted}.${monthFormatted}.${year}`
       // }
    } catch (error) {
        console.error(error)
    }
}

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

// const hazardLevels = [
//     { bck_color: "#4CAF50", range: [1, 6], action: "No action needed" },
//     { bck_color: "#ffb833", range: [7, 12], action: "Monitor closely" },
//     { bck_color: "#FF8C00", range: [13, 18], action: "Take preventive measures" },
//     { bck_color: "#FF0000", range: [19, 24], action: "Implement immediate action" },
//     { bck_color: "#8B00FF", range: [25, 25], action: "Immediate intervention necessary" }
// ];

// const hazardLevels = [
//     { bck_color: "#4CAF50", range: [1, 6], action: "No action needed" },
//     { bck_color: "#ffb833", range: [7, 9], action: "Monitor closely" },
//     { bck_color: "#FFD700", range: [10, 12], action: "Heightened monitoring required" }, // New range
//     { bck_color: "#FF8C00", range: [13, 18], action: "Take preventive measures" },
//     { bck_color: "#FF0000", range: [19, 24], action: "Implement immediate action" },
//     { bck_color: "#8B00FF", range: [25, 25], action: "Immediate intervention necessary" }
// ];

// function getHazardColor(number) {
//     if (number > 25) number = 25
//         for (let level of hazardLevels) {
//             const [min, max] = level.range;
//             if (number >= min && number <= max) {
//                 return { action: level.action, bck_color: level.bck_color }
//         }
//     }
//     return null;
// }

const resultLiterals = {

    // compliance_mapping: (data) => {
    //     console.log(data)
    //     let c = segmentHeadline('Compliance Mapping', 'result_compliance')
    //     data.map(a => {
    //         const content = `${a.regulation} - ${a.clauses}`
    //         c += `<div class='result-box-content'>${content}</div>`
    //     })
    //     c += `</div>`
    //     return c
    // },
    // facilities: (data) => {
    //     let c = segmentHeadline('Facility Register', 'result_facility')
    //     data.map(a => {
    //         const content = `${a.facility} - ${a.type}`
    //         c += `<div class='result-box-content'>${content}</div>`
    //     })
    //     return c
    // },
    risk_assessment: (data) => {
        const RISK_ASSESSMENT = data.content['Risk Evaluation']

        const result = {}

        let html = segmentHeadlineText('Risk Evaluation')
        const hazards = RISK_ASSESSMENT
        .filter(f => !f.deleted)
        .sort((a, b) => b.risk_rating - a.risk_rating)
            .map(({ c, hazard, type, likelihood, severity, risk_rating, comment, area, decision, compliance, checked = false, safeguards }) => {
            const { action, bck_color } = getHazardRangeColor(risk_rating)

            let complianceTerm = [];
            if (compliance) {
                compliance.forEach(c => {
                    let intern = c.regulation
                    c.clauses.forEach(cl => {
                        intern += ` - ${cl}`;
                    });
                    complianceTerm.push(intern)
                });
            }

            if (comment && comment.timestamp) comment.timestamp = convertFromZulu(comment.timestamp)

            let res = {
                c,
                likelihood, severity,
                ratingClr: bck_color,
                title: hazard, //area ? `${hazard} - ${area}` : hazard,
                subTitle: type,
                maintext: decision,
                subText: undefined,
                comment,
                compliance: complianceTerm,
                checked,
                action: action,
                safeguards
            };
                return res
        })

        if (data.content.Description) result.description = data.content.Description
        
        html += `<div class='result-box-content hazard-text'>${data.content.Description}</div>`


        Object.keys(data).map(a => {
            data[a.toLowerCase()] = data[a]
            delete data[a]
        })

        if (data.context) result.context = data.context
        if (data.executiontime) result.executiontime = data.executiontime
        return { hazards, result }
    },
    // risk_observation: (data) => {
    //     console.log(data)
    //     let c = segmentHeadline('Risk Observation', 'result_risk')
    //     c += `<div class='result-box-content'>${highlightWords(data.Description, 'risks')}</div>`
    //     data['Risk Scenarios'].map(a => {
    //         c += `<div class='result-box-content loop'>`
    //         c += `<div class="result-box-entry">Finding: ${a.Finding}</div>`
    //         c += `<div class="result-box-entry">Risk Score: ${highlightWords(a['Risk Score']['Score'], 'conformity') } ${a['Risk Score']['Reason']}</div>`
    //         c += `<div class="result-box-entry">Norm reference: ${a['Norm reference']}</div>`
    //         c += `<div class="result-box-entry">Root Cause: ${a['Root Cause']}</div>`
    //         c += `</div>`
    //     })
    //     return c
    // },
    // VDE_Details: (details) => {
    //     let c = ''
    //     Object.keys(details).some(detail => {
    //         const content = details[detail]
    //         if (content[0] === 'n/a') return
    //         c += segmentHeadlineText(detail)
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content float'>`
    //             content
    //             .filter(c =>  c !== 'n/a')
    //             .some(segment => {
    //                 c += `<div class='risk-tag _t'>${segment}</div>`
    //             })
    //         c += `</div>`
    //         c += `</div>`
    //     })
    //     return c
    // },
    // iso_assessment: (data) => {
    //     Object.keys(data).map(a => {
    //         data[a.toLowerCase()] = data[a]
    //         delete data[a]
    //     })

    //     let c = ''//segmentHeadline('VDE Assessment', 'vde')
    //     if (data.description) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.description, 'risks')}</div>`
        
    //     if (data.norm_references){
    //     c += segmentHeadlineText('ISO Audit Assessment')
    //         console.log(data.norm_references[0])
    //         data.norm_references[0].Chapters.map(a => {
    //         const auditquestion = `${a.Clause} - ${a.Title}`
    //         c += `<div class='result-box-content r-h1'>${auditquestion}</div>`
    //         c += `<div class='result-box-content'>${a.Auditquestion}</div>`
    //         const findings = highlightWords(a.Finding).replace(':','')
    //         c += `<div class='result-box-content r-h2'>${findings}</div>`
    //         })
    //     c += `</div>`
    //     }
        
    //     if (data.context) {
    //         c += segmentHeadlineText('Context')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content results-segment-item'>${data.context}</div>`
    //         c += `</div>`
    //     }
    //     if (data.evidences) {
    //         c += segmentHeadlineText('Evidences')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content results-segment-item'>${data.evidences}</div>`
    //         c += `</div>`
    //     }
    //     if (data.executiontime) {
    //         c += segmentHeadlineText('Execution Time')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content results-segment-item'>${data.executiontime}</div>`
    //         c += `</div>`
    //     }
    //     return c
    // },  
    // vde: (data) => {
    //     Object.keys(data).map(a => {
    //         data[a.toLowerCase()] = data[a]
    //         delete data[a]
    //     })

    //     let c = ''//segmentHeadline('VDE Assessment', 'vde')
    //     if (data.description) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.description, 'risks')}</div>`
              
    //     if (data.observations) c += `<div class='result-box-content results-segment-item'>${highlightWords(data.observations.join(' '), 'risks')}</div>`
    //     //if (data.details[0]) c += resultLiterals.VDE_Details(data.details[0])
               
    //     if (data.findings) {
    //         c += segmentHeadlineText('VDE Assessment')
    //         data.findings
    //             .sort((a, b) => {
    //                 if (a.assessment === 'true') return -1;
    //                 if (b.assessment === 'true') return 1;
    //                 if (a.assessment < b.assessment) return -1;
    //                 if (a.assessment > b.assessment) return 1;
    //                 return 0;
    //             })
    //             .map(({ assessment, explanation, question }) => {
    //                 c += `<div class='result-box-assessment results-segment-item'>`
    //                 c += `<div class='result-box-content loop'>`
    //                 c += `<div class="result-title-mini">${question}</div>`
    //                 c += `<div class="result-title-">${explanation}</div>`
    //                 c += `</div>`
    //                 const symbol = assessment === "true" ? 'check' : (assessment === "n/a" ? 'n_a' : 'uncheck')
    //                 c += `<div class='checklist-svg'>${svgInst.assessments(symbol)}</div>`
    //                 c += `</div>`
    //                 c += `</div>`
    //             })
    //     }

    //     if (data.segmentation) {
    //     c += segmentHeadlineText('Segmentation')
    //     c += `<div class="results-segment-item">`
    //     c += `<div class='result-box-content float'>`
    //     data.segmentation.map(segment => {
    //     c += `<div class='risk-tag'>${segment}</div>`
    //     })
    //     c += `</div>`
    //     c += `</div>`
    //     }

    //     if (data.equipment) {
    //         c += segmentHeadlineText('Equipment')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content float'>`
    //         data.equipment.map(equipment => {
    //             c += `<div class='risk-tag'>${equipment}</div>`
    //         })
    //         c += `</div>`
    //         c += `</div>`
    //     }

    //     if (data.protective_devices) {
    //         c += segmentHeadlineText('Protective Devices')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content float'>`
    //         data.protective_devices.map(protective_device => {
    //             c += `<div class='risk-tag'>${protective_device}</div>`
    //         })
    //         c += `</div>`
    //         c += `</div>`
    //     }

    //     if (data.lables) {
    //         c += segmentHeadlineText('Lables')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content float'>`
    //         data.lables.map(lable => {
    //             c += `<div class='risk-tag'>${lable}</div>`
    //         })
    //         c += `</div>`
    //         c += `</div>`
    //     }

    //     if (data.recommendations) {
    //         c += segmentHeadlineText('Recommendations')
    //         if (data.morephotosof) {
    //             c += `<div class="results-segment-item">`
    //             c += `<div class='result-box-content loop'>Take more Photos of: ${data.morephotosof.join(' ')}`
    //             c += `</div></div>`
    //         }
    //         data.recommendations.map(recommendation => {
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content loop'>${recommendation}`
    //         c += `</div></div>`
    //     })
    //     }

    //     if (data.executiontime) {
    //         c += segmentHeadlineText('Execution Time')
    //         c += `<div class="results-segment-item">`
    //         c += `<div class='result-box-content results-segment-item'>${data.executiontime}</div>`
    //         c += `</div>`
    //     }

    //     return c
    // }
}

export class ResultRenderer {

    renderResult = async ({results}) => {
        return new Promise(async (resolve, reject) => {
            const last = results.length - 1
            const resultLast = results[last] //Maybe LOOP LATER
            // console.log(resultLast)
            // const baseData = resultLast.content['Risk Evaluation']
            //Quick fix for demo
            let assessment = resultLast.Assessment === 'iso_audit_assessment' ? 'iso_assessment' : resultLast.Assessment
            
            //{ ratingClr, title, subTitle, maintext, subText, checked, action } 
            const { hazards, result } = resultLiterals[assessment](resultLast)
            resolve({
                hazards,
                result
                // lastUpdated: 'Heute',//!!!!!!!!!!!!!!!!!!!!!
                // outputResults: [resultLiterals[assessment](resultLast)],
                // baseData
        })
    });
    }

    // renderContainer = ({fn, content}) => {
    //     const projectTitle = document.createElement('div');
    //     projectTitle.classList.add('result-box')
    //     let c = `<div class='result-box-icon'>${svgInst[fn]()}</div>`
    //     c += `<div class='result-box-content'>${content}</div>`
    //     projectTitle.innerHTML = c
    //     return projectTitle
    // }

    // textContainer = ({ fn, content }) => {
    //     let c = `<div class='result-box-icon'>${svgInst[fn]()}</div>`
    //     c += `<div class='result-box-content'>${content}</div>`
    //     return c
    // }

    // renderNormReferences = ({ content }) => {
    //     const projectTitle = document.createElement('div');
    //     let c = ''
    //     content[0].Chapters.map(a => {
    //         const { Clause, Title, Auditquestion, Finding } = a
    //         c += `<div class='result-box loop title'>${this.textContainer({ fn:'element_tags', content: `${Clause} - ${Title}` })}</div>`
    //         c += `<div class='result-box loop audit-question'>${this.textContainer({ fn:'element_question', content: `${Auditquestion}` })}</div>`
    //         c += `<div class='result-box loop'>${this.textContainer({ fn: 'element_audit_answer', content: `${this.highlightWords(Finding) }` })}</div>`
    //     })
    //     projectTitle.innerHTML = c
    //     return projectTitle
    // }
}