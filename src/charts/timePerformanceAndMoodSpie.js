import {distinctColorForEmotion, continuousColorForEmotion} from '../utilities/colors.js';
import {drawPolarTimeAndPerformanceCoordinateSystem} from '../utilities/coordinateSystem.js';
import {COLOR_SHAPE_STROKE} from '../utilities/colors.js';
import {check} from '../utilities/checkInputData.js';
import {pie, arc, select} from 'd3';


export function drawTimePerformanceMoodSpie(DOMelementId, performanceEmotionsData) {

    const inputFormat = [{topic: null, timeInMinutes:null, performance: null, mood: null}];
    check(performanceEmotionsData, DOMelementId, inputFormat);

    const cs = drawPolarTimeAndPerformanceCoordinateSystem(DOMelementId);

    const spiepie = pie().value((p) => p.timeInMinutes);

    const pieDrawData = spiepie(performanceEmotionsData);

    const strokeWidth = COLOR_SHAPE_STROKE;

    const spiearc = arc()
        .innerRadius((p) =>
            cs.scale(p.data.performance) - (strokeWidth/2))
        .outerRadius((p) => cs.scale(p.data.performance) + (strokeWidth/2))
        .cornerRadius(1);
    const smallArc = arc()
        .innerRadius(cs.innerRadius)
        .outerRadius((p) =>
            cs.scale(p.data.performance)
            - strokeWidth);

    function drawPiePiece(pieDrawDatum){
        const g = select(this);
        g.append('path')
            .attr('style', 'stroke:'+distinctColorForEmotion(pieDrawDatum.data.mood.v, pieDrawDatum.data.mood.a)+
                '; stroke-width: '+strokeWidth+'px;')
            .attr('d', spiearc);
        g.append('path')
            .attr('fill', continuousColorForEmotion(pieDrawDatum.data.mood.v, pieDrawDatum.data.mood.a))
            .attr('stroke', 'none')
            .attr('d', smallArc)
            .on('mouseover', function(d) {
                const centroid = smallArc.centroid(d);
                cs.center.append('text')
                    .classed('mouseovertext', true)
                    .attr('text-anchor', 'middle')
                    .text(d.data.topic)
                    .attr('x', centroid[0])
                    .attr('y', centroid[1]); })
            .on('mouseout', ()=> cs.center.select('.mouseovertext').remove());

    }

    cs.center.append('g')
        .selectAll('.piepiece')
        .data(pieDrawData)
        .enter()
        .append('g')
        .attr('class', 'piepiece')
        .each(drawPiePiece);

}