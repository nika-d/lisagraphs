import {drawCartesianColorCoordinateSystem} from '../utilities/coordinateSystem.js';
import {check} from '../utilities/checkInputData.js';


export function drawPerformanceInEmotionsScatterPlot(DOMelementId, performanceEmotionsData) {

    check(performanceEmotionsData, DOMelementId, [{performance: null, mood: null}]);


    const cs = drawCartesianColorCoordinateSystem(DOMelementId);

    performanceEmotionsData = performanceEmotionsData.map((ped) => {
        return {
            performance: ped.performance,
            mood: cs.scale(ped.mood.v, ped.mood.a)
        };
    });

    const gradients = cs.center.append('defs')
        .selectAll('radialGradient')
        .data(performanceEmotionsData)
        .enter()
        .append('radialGradient')
        .attr('id', (p, i) => 'grad' + i);
    gradients.append('stop')
        .attr('offset', '0%')
        .attr('style', (p) =>
            'stop-color: hsl(0,0%,' + (100 - p.performance) + '%); stop-opacity: ' + (p.performance / 100));
    gradients.append('stop')
        .attr('offset', '50%')
        .attr('style', (p) => 'stop-color: hsl(0,0%,' + (100 - p.performance) + '%); stop-opacity: 1');
    gradients.append('stop')
        .attr('offset', '100%')
        .attr('style', (p) => 'stop-color: hsl(0,0%,' + ((100 - p.performance) / 1.3) + '%); stop-opacity: 1');

    cs.center.selectAll('circle')
        .data(performanceEmotionsData)
        .enter()
        .append('circle')
        .attr('cx', (d) => d.mood.v)
        .attr('cy', (d) => d.mood.a)
        .attr('r', cs.lineHeight / 4)
        .attr('style', 'stroke: none')
        .attr('fill', (d, i) => 'url(#grad' + i + ')');
}