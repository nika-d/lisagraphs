import {continuousColorForEmotion} from '../utilities/colors.js';
import {check} from '../utilities/checkInputData.js';
import * as vis from 'vis';


export function drawTimelineForSession(
    DOMelementId,
    emotions,
    offsetDate,
    aggregationMillis
) {
    check(emotions, 'timeline', [{v:null, a:null}]);


    const container = document.getElementById(DOMelementId);

    container.classList.add('timeline');

    const items = colorsTimeFrames(emotions, offsetDate, aggregationMillis);

    const options = {
        format: format,
        selectable: false,
        showCurrentTime: false,
        type: 'background',
        min: offsetDate,
        max: items[items.length - 1].end.getTime(),
        zoomable: false
    };

    new vis.Timeline(container, items, options);
}

const format = {
    majorLabels: {
        minute: 'ddd D MMM YYYY',
        hour: 'ddd D MMM YYYY'
    }
};

function colorsTimeFrames(emotions, offsetDate, aggregationMillis) {
    const millis = offsetDate.getTime();

    const emotionColors = emotions.map((e, index) => {
        return {
            color: continuousColorForEmotion(e.v, e.a),
            start: new Date(millis + index * aggregationMillis),
            end: new Date(millis + index * aggregationMillis + aggregationMillis - 1)
        };
    });

    const bundleSameEmotions = function(acc, e) {
        if (acc[acc.length - 1].color === e.color) acc[acc.length - 1].end = e.end;
        else acc.push(e);
        return acc;
    };

    const emotionColorsTimeFrames = emotionColors.reduce(bundleSameEmotions, [
        emotionColors[0]
    ]);

    return emotionColorsTimeFrames.map(e => {
        return {
            start: e.start,
            end: e.end,
            className: 'emotion-time-frame',
            style: 'background-color: ' + e.color
        };
    });
}
