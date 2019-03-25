import {select, scaleLinear, style} from 'd3';


export const POLAR_CS_OUTER_LABEL_HEIGHT_FACTOR = 1.2,
    POLAR_CS_INNER_LABEL_WIDTH_FACTOR = 3,
    POLAR_CS_ARROW_ROTATION_FACTOR = 1.7,
    POLAR_CS_LABEL_Y_DISTANCE_FROM_LINE = 3,
    CARTESIAN_CS_LABEL_POSITION = -0.5,
    CARTESIAN_CS_AXIS_DISTANCE_FACTOR = 2,
    HORIZONTAL_BARCHART_LABEL_HEIGHT_FACTOR = 1.9;


export {
    getHorizontalBarChartBasics,
    getNormalizedCoordinateBasics,
    getPolarCoordinateBasics,
};

function getHorizontalBarChartBasics(container) {

    const totalWidth = container.node().getBoundingClientRect().width,
        totalHeight = container.node().getBoundingClientRect().height,
        fontSize = getAxisFontSize(container),
        chartHeight = totalHeight - HORIZONTAL_BARCHART_LABEL_HEIGHT_FACTOR * fontSize;

    return {
        totalWidth: totalWidth,
        totalHeight: totalHeight,
        fontSize: fontSize,
        leftMargin: fontSize * 3,
        yAxisScale: scaleLinear().domain([0, 100]).range([chartHeight, 0]),
        heightScale: scaleLinear().domain([0, 100]).range([0, chartHeight])
    };
}

function getNormalizedCoordinateBasics(container) {

    const totalSize = getAvailableSpace(container);
    const axisFontSize = getAxisFontSize(container);

    const axisMargin = 2.5 * axisFontSize;

    const fontOffset = 0.5 * axisFontSize;
    const chartSize = totalSize - axisMargin;

    const xScale = scaleLinear().domain([-1, 1]).range([-chartSize / 2, chartSize / 2]);
    const yScale = scaleLinear().domain([-1, 1]).range([chartSize / 2, -chartSize / 2]);

    return {
        totalSize: totalSize,
        chartSize: chartSize,
        lineHeight: 1.2 * axisFontSize,
        fontOffset: fontOffset,
        xScale: xScale,
        yScale: yScale
    };
}

function getPolarCoordinateBasics(container) {
    const fontSize = getAxisFontSize(container);
    const totalSpace = getAvailableSpace(container);
    const chartSpace = totalSpace - (POLAR_CS_OUTER_LABEL_HEIGHT_FACTOR * fontSize);
    const minRadius = fontSize * POLAR_CS_INNER_LABEL_WIDTH_FACTOR;
    const maxRadius = (chartSpace / 2) - 1; // -1 for outer stroke
    const performanceScale = scaleLinear().domain([0, 100]).range([minRadius, maxRadius]);
    return {
        fontSize: fontSize,
        totalSpace: totalSpace,
        chartSpace: chartSpace,
        minRadius: minRadius,
        maxRadius: maxRadius,
        scale: performanceScale
    };
}

function getAvailableSpace(selectedElementOrId) {

    const element = (typeof selectedElementOrId === 'string' ?
        select(selectedElementOrId) : selectedElementOrId);
    const boundingRect = element.node().getBoundingClientRect();
    return Math.max(boundingRect.height, boundingRect.width);
}

function getAxisFontSize(container) {
    // todo what if fontsize not in px defined?
    const outerFontSize = style(container.node(), 'font-size');
    const axisFontSize = parseFloat(outerFontSize.substr(0, outerFontSize.length - 2));
    return axisFontSize;
}