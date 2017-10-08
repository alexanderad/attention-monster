import db from "./db.js";
import logger from "./logger.js";

class Reporter {
  constructor() {
    this.IDLE_MAX_ACCOUNTABLE = 60 * 1000; // milliseconds
  }

  onScreenTimeReport(start, end) {
    /*
      Returns a promise with results: array sorted by total time
      [
        {
          domain: <domain>, 
          icon: <icon>,
          totalTime: <total time in seconds>, 
          timeIntervals: [
            [<interval start timestamp>, <interval end timestamp>],
            ...
          ]
        },
        ...
      ]
      */
    return db.icons
      .toArray(items => {
        let iconLookup = {};
        items.forEach(function(element) {
          iconLookup[element.domain] = element.icon;
        }, this);
        return iconLookup;
      })
      .then(iconLookup => {
        return db.events
          .where("time")
          .between(start, end)
          .toArray(items => {
            let results = {};
            logger.log("items to account", items.length);
            for (let i = 1; i < items.length; i++) {
              let domain = items[i - 1].domain;
              let accountableTime = Math.min(
                items[i].time - items[i - 1].time,
                this.IDLE_MAX_ACCOUNTABLE
              );
              let interval = [
                items[i - 1].time,
                items[i - 1].time + accountableTime
              ];
              if (results[domain] === undefined) {
                results[domain] = {
                  domain: domain,
                  totalTime: 0,
                  timeIntervals: [],
                  icon: iconLookup[domain]
                };
              }
              results[domain].totalTime += accountableTime;
              results[domain].timeIntervals.push(interval);
            }

            results = Object.keys(results).map(key => results[key]);
            results.sort(function(a, b) {
              return b.totalTime - a.totalTime;
            });
            return results;
          });
      });
  }

  frequencyChart(chartStart, chartEnd, intervals) {
    chartStart = chartStart.toFixed(2);
    chartEnd = chartEnd.toFixed(2);
    let chartWidth = chartEnd - chartStart;
    let bar = $("<div/>", {
      class: "stacked-bar-container",
      style: "min-width: 100px"
    });

    for (let i = 0; i < intervals.length; i++) {
      let start = intervals[i][0];
      let end = intervals[i][1];
      let width = (end - start) / chartWidth * 100;
      let offset = (start - chartStart) / chartWidth * 100;
      bar.append(
        $(
          `<span class="bar" style="left: ${offset}%; width: ${width}%">&nbsp;</span>`
        )
      );
    }
    return bar;
  }
}

const reporter = new Reporter();
export default reporter;
