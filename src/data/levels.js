// const hazardRange = [
//     { bck_color: "#4CAF50", range: [1, 6], action: "No action needed" },
//     { bck_color: "#ffb833", range: [7, 12], action: "Monitor closely" },
//     { bck_color: "#FF8C00", range: [13, 18], action: "Take preventive measures" },
//     { bck_color: "#FF0000", range: [19, 24], action: "Implement immediate action" },
//     { bck_color: "#8B00FF", range: [25, 25], action: "Immediate intervention necessary" }
// ];

const hazardRange = [
    { bck_color: "#4CAF50", font_color: "#FFFFFF", range: [1, 6], action: "No action needed" },
    { bck_color: "#ffb833", font_color: "#000000", range: [7, 9], action: "Monitor closely" },
    { bck_color: "#FFD700", font_color: "#000000", range: [10, 12], action: "Heightened monitoring required" },
    { bck_color: "#FF8C00", font_color: "#FFFFFF", range: [13, 18], action: "Take preventive measures" },
    { bck_color: "#D1011B", font_color: "#FFFFFF", range: [19, 24], action: "Implement immediate action" },
    { bck_color: "#8B00FF", font_color: "#FFFFFF", range: [25, 25], action: "Immediate intervention necessary" }
];

export const hazardRangeExt = () => {
    return hazardRange
}

export const getHazardRangeColor = (number) => {
    if (number > 25) number = 25;
    for (let level of hazardRange) {
        const [min, max] = level.range;
        if (number >= min && number <= max) {
            return { action: level.action, bck_color: level.bck_color};
        }
    }
    return null;
};

const hazardLevels = [
    { bck_color: "#4CAF50", number: 1 },
    { bck_color: "#ffb833", number: 2 },
    { bck_color: "#FF8C00", number: 3 },
    { bck_color: "#FF0000", number: 4 },
    { bck_color: "#8B00FF", number: 5 }
];

export const getHazardColor = (number) => {
    if (number > 25) number = 25;  // Ensure that the number doesn't exceed 25
    // Loop through the hazardLevels to find the matching color for the number
    for (let level of hazardLevels) {
        if (number === level.number) {
            return { bck_color: level.bck_color };  // Return the corresponding background color
        }
    }

    // Return null if no match is found
    return null;
};
