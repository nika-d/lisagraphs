import ExampleData from './exampleData.js';

lg.drawColorDefinitionPrinciple('chart1');
lg.drawTimelineForSession('chart2', ExampleData.sessionValues.values,
    new Date(Date.now()), ExampleData.aggregationMillisSession);
lg.drawMoodsRelationsPerTopicChart('chart5', ExampleData.perTopicMoodsRelations);
lg.drawPerformanceInEmotionsScatterPlot('chart6', ExampleData.performanceInEmotions);
lg.drawTimePerformanceMoodSpie('chart7', ExampleData.timePerformanceAndMood1);
lg.drawTimePerformanceMoodSpie('chart8', ExampleData.timePerformanceAndMood2);