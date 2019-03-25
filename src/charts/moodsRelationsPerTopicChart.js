import {COLOR_SHAPE_STROKE, distinctColorForEmotion, continuousColorForEmotion} from '../utilities/colors.js';
import {check} from '../utilities/checkInputData.js';
import {getHorizontalBarChartBasics} from '../utilities/coordinateSystemUtilities.js';
import {select, axisLeft, axisBottom, scaleBand, scaleLinear} from 'd3';

export function drawMoodsRelationsPerTopicChart(DOMelementId, perTopicMoodsRelationsChartData) {

    const inputFormat = [{topic: null, performance: null, moods:[{mood:{v:null, a:null}, percentage:null}]}];
    check(perTopicMoodsRelationsChartData, DOMelementId, inputFormat);

    // data preparation
    const dataWithColorKeys = perTopicMoodsRelationsChartData.map((e) => {
        e.moods = e.moods.map((moodWithPercentage, index, allMoods) => {
            let last = 0;
            const mood = moodWithPercentage.mood;
            for (let i = 0 ; i < index ; i++)
                last += allMoods[i].percentage;
            return {
                distinctColor: distinctColorForEmotion(mood.v, mood.a),
                continuousColor: continuousColorForEmotion(mood.v, mood.a),
                from: last,
                width: moodWithPercentage.percentage,
                performance: e.performance
            };
        });
        return e;
    });

    // container
    const container = select('#'+DOMelementId).classed('horizontal-stacked-bar-chart', true);

    const coords = getHorizontalBarChartBasics(container);

    function drawChart () {

        // svg and chart space
        const chart = container.append('svg')
            .attr('viewBox', '0 0 ' + coords.totalWidth + ' ' + coords.totalHeight)
            .append('g')
            .attr('transform', 'translate('+ (coords.leftMargin) +','+ (coords.fontSize/3) +')');


        // scales and axis

        const axesG = chart.append('g').classed('axis', true);

        axesG.append('g').call(axisLeft(coords.yAxisScale).ticks(5));
        axesG.append('text')
            .attr('transform',
                'rotate(-90) ' +
                'translate('+ (-coords.totalHeight +  coords.fontSize/3) +','+ (-coords.leftMargin+coords.fontSize) +')')
            .text('Performance in %');

        const xScale = scaleBand()
            .domain(perTopicMoodsRelationsChartData.map((e) => e.topic))
            .range([0, coords.totalWidth - coords.leftMargin])
            .paddingInner(0.1)
            .paddingOuter(0.05);

        const xAxisG = axesG.append('g')
            .attr('transform', 'translate(0, ' + (coords.yAxisScale(0)) + ')')
            .call(axisBottom(xScale));
        xAxisG.selectAll('line').style('display', 'none');
        xAxisG.selectAll('.tick').selectAll('text').attr('font-size', coords.fontSize);

        const innerXScale = scaleLinear()
            .domain([0, 100])
            .range([0, xScale.bandwidth()]);

        //Background axes lines
        axesG.append('line').classed('grid', true)
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', coords.totalWidth-coords.leftMargin).attr('y2', 0);
        axesG.append('line').classed('grid', true)
            .attr('x1', 0).attr('y1', coords.yAxisScale(20))
            .attr('x2', coords.totalWidth-coords.leftMargin).attr('y2', coords.yAxisScale(20));
        axesG.append('line').classed('grid', true)
            .attr('x1', 0).attr('y1', coords.yAxisScale(40))
            .attr('x2', coords.totalWidth-coords.leftMargin).attr('y2', coords.yAxisScale(40));
        axesG.append('line').classed('grid', true)
            .attr('x1', 0).attr('y1', coords.yAxisScale(60))
            .attr('x2', coords.totalWidth-coords.leftMargin).attr('y2', coords.yAxisScale(60));
        axesG.append('line').classed('grid', true)
            .attr('x1', 0).attr('y1', coords.yAxisScale(80))
            .attr('x2', coords.totalWidth-coords.leftMargin).attr('y2', coords.yAxisScale(80));

        function drawTopicPart(mood){
            const g = select(this);
            const height = (coords.heightScale(mood.performance));
            g.append('rect')
                .attr('x', innerXScale(mood.from))
                .attr('y', '0')
                .attr('width', innerXScale(mood.width))
                .attr('height', height)
                .attr('style', 'fill:'+ mood.continuousColor);
            g.append('line')
                .attr('x1', innerXScale(mood.from))
                .attr('y1', COLOR_SHAPE_STROKE/2)
                .attr('x2', innerXScale(mood.from) + innerXScale(mood.width))
                .attr('y2', COLOR_SHAPE_STROKE/2)
                .attr('style', 'stroke-width:'+ COLOR_SHAPE_STROKE + ';stroke:' + mood.distinctColor);
        }

        // data drawing
        const barsGroup = chart.append('g');
        barsGroup.selectAll('g')
            .data(dataWithColorKeys)
            .enter()
            .append('g')
            .attr('transform', (d) =>
                'translate(' + xScale(d.topic) + ' ' + coords.yAxisScale(d.performance) + ') ' )
            .selectAll('.topicpart')
            .data((d) => d.moods)
            .enter()
            .append('g')
            .attr('class', 'topicpart')
            .each(drawTopicPart);
    }
    drawChart();
}