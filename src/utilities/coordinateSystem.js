import {POLAR_CS_OUTER_LABEL_HEIGHT_FACTOR,
    POLAR_CS_ARROW_ROTATION_FACTOR,
    POLAR_CS_LABEL_Y_DISTANCE_FROM_LINE,
    CARTESIAN_CS_LABEL_POSITION,
    CARTESIAN_CS_AXIS_DISTANCE_FACTOR,
    getPolarCoordinateBasics,
    getNormalizedCoordinateBasics} from './coordinateSystemUtilities.js';
import {drawGradientChartBackground} from './colors.js';
import {select, axisBottom, axisRight, format} from 'd3';

export {
    drawPolarTimeAndPerformanceCoordinateSystem,
    drawCartesianColorCoordinateSystem
};

function drawPolarTimeAndPerformanceCoordinateSystem(DOMelementId) {

    const container = select('#'+DOMelementId)
        .classed('coordinate-system', true);
    const coords = getPolarCoordinateBasics(container);

    const CENTER = container.append('svg')
        .attr('viewBox', '0 0 ' + coords.totalSpace + ' ' + coords.totalSpace)
        .append('g')
        .attr('transform', 'translate(' + coords.totalSpace/2 + ','
            + (coords.maxRadius + POLAR_CS_OUTER_LABEL_HEIGHT_FACTOR * coords.fontSize) + ')');

    const axesG = CENTER.append('g').classed('axis', true);

    axesG.append('path')
        .attr('d', 'M 0 ' + (coords.minRadius + coords.fontSize) +
                ' A ' + coords.minRadius + ' ' + coords.minRadius + ' 0 1 1 ' +
                '0.5 ' + (coords.minRadius + coords.fontSize))
        .attr('style', 'stroke:none')
        .attr('id', DOMelementId + '0circle');
    axesG.append('text').attr('y', POLAR_CS_LABEL_Y_DISTANCE_FROM_LINE).attr('x', coords.minRadius*Math.PI)
        .attr('text-anchor', 'middle')
        .attr('font-size',coords.fontSize)
        .append('textPath').attr('xlink:href', '#'+DOMelementId+'0circle')
        .text('Time');


    const textWidth = axesG.select('text').node().getBBox().width;
    const arrowRadius = coords.minRadius - coords.fontSize/2;
    const arrowAngle = Math.asin(textWidth/(2*arrowRadius));
    const arrowEndY = -(arrowRadius * Math.cos(arrowAngle));
    const arrowEndX = -textWidth/2;

    axesG.append('path')
        .attr('d', 'M ' + -arrowEndX + ' '+ arrowEndY +
                ' A ' + arrowRadius + ' ' + arrowRadius + ' 0 1 1 '
                + arrowEndX + ' ' + arrowEndY);
    const arrowG = axesG.append('g')
        .attr('transform',
            'translate(' + arrowEndX + ' ' + arrowEndY + ') '+
                'rotate('+ ( POLAR_CS_ARROW_ROTATION_FACTOR *(arrowAngle*180) / Math.PI) +')');
    arrowG.append('line').attr('x0', 0).attr('y0', 0)
        .attr('x1', -coords.fontSize/3).attr('y1', coords.fontSize/2);
    arrowG.append('line').attr('x0', 0).attr('y0', 0)
        .attr('x1', coords.fontSize/3).attr('y1', coords.fontSize/2);


    axesG.append('path')
        .attr('d', 'M 0 ' + coords.maxRadius +
                ' A ' + coords.maxRadius + ' ' + coords.maxRadius + ' 0 1 1 0.5 ' + coords.maxRadius)
        .attr('id', DOMelementId+'100circle');

    axesG.append('text').attr('y', -POLAR_CS_LABEL_Y_DISTANCE_FROM_LINE).attr('x', coords.maxRadius*Math.PI)
        .attr('text-anchor', 'middle')
        .attr('font-size', coords.fontSize)
        .append('textPath').attr('xlink:href', '#'+DOMelementId+'100circle')
        .text('100% Performance');

    const percent20 = (coords.maxRadius - coords.minRadius) / 5;
    axesG.append('circle').attr('r', coords.minRadius + percent20).classed('grid', true);
    axesG.append('circle').attr('r', coords.minRadius + 2*percent20).classed('grid', true);
    axesG.append('circle').attr('r', coords.minRadius + 3*percent20).classed('grid', true);
    axesG.append('circle').attr('r', coords.minRadius + 4*percent20).classed('grid', true);

    return {
        center: CENTER,
        innerRadius: coords.minRadius,
        scale: coords.scale
    };
}

function drawCartesianColorCoordinateSystem(DOMelementId) {

    const container = select('#'+DOMelementId).classed('coordinate-system', true);
    const coords = getNormalizedCoordinateBasics(container);

    const svg = container.append('svg')
        .attr('viewBox', '0 0 ' + coords.totalSize + ' ' + coords.totalSize);

    drawGradientChartBackground(svg, coords.chartSize, coords.fontOffset);

    const centerCoords = (coords.fontOffset + coords.chartSize / 2);
    const center = svg.append('g').attr('transform', 'translate(' + centerCoords + ',' + centerCoords + ')');

    drawNormalizedVandAaxes(svg, coords);

    return {
        center: center,
        scale: function (v, a) {
            return {v: coords.xScale(v), a: coords.yScale(a)};
        },
        lineHeight: coords.lineHeight
    };
}

function drawNormalizedVandAaxes(svg, coords){

    const axesG = svg.append('g').classed('axis', true);
    const xAxis = axisBottom()
        .scale(coords.xScale)
        .tickValues([-1, 0, 1])
        .tickFormat(format('d'));

    const xAxisGroup = axesG.append('g').attr('transform', 'translate(' +
        (coords.fontOffset + coords.xScale(1)) + ',' +
        (coords.chartSize + CARTESIAN_CS_AXIS_DISTANCE_FACTOR * coords.fontOffset) +')');

    xAxisGroup.append('g').call(xAxis);
    xAxisGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', coords.xScale(CARTESIAN_CS_LABEL_POSITION))
        .attr('y', coords.lineHeight)
        .text('Valence');

    const yAxis = axisRight()
        .scale(coords.yScale)
        .tickValues([-1, 0, 1])
        .tickFormat(format('d'));

    const yAxisGroup = axesG.append('g').attr('transform', 'translate(' +
        (coords.chartSize + CARTESIAN_CS_AXIS_DISTANCE_FACTOR * coords.fontOffset) + ', ' +
        (coords.fontOffset + coords.yScale(-1) ) + ')');

    yAxisGroup.append('g').call(yAxis);
    yAxisGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', coords.yScale(-CARTESIAN_CS_LABEL_POSITION))
        .attr('y', coords.lineHeight)
        .attr('transform', 'rotate(-90)')
        .text('Arousal');
}