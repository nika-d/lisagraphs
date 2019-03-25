
**Timelines of moods**

First realisized them with Chartist.js, but zooming was not supported, the axis descriptions just got bigger/smaller 
without adding/removing values. Second approach was to use Vis.js, which worked fine. 

**Barcharts of moods**

Chartist.js did a really good and easy job at the beginning, but the horizontally stacked chart would have been very 
hacky. Because of that, finally it was realized with D3.js.  

**Scatterplot of performance in emotions**

The difficulty here was to guarantee correct colors in the coordinate system. Multicolor gradients can be implemented
most efficiently with CSS gradients. Still, since CSS offers just linear and radial gradients, a complex geometry of 
radial gradients would have been necessary. So the background of the coordinate system was realized by a pixel matrix
colored with D3-interpolations as shown in http://bl.ocks.org/syntagmatic/5bbf30e8a658bcd5152b . By this approach, same 
color scales for all charts are provided.   

**Data formats**

 20 * ca. 1 Stunde, 10-Minten-Abschnitte

call id = 1, time = 2018-01-09T18:31:42P5M, aggregationMillis


Time, performance and Mood:

tuples of (topic, performance, mood, totalTime)
call for mood: id = 1, times = [ '2018-01-09T18:31:42P5M' ,'2018-01-10T18:31:42P2H', ...]