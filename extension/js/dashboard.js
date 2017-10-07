$(document).ready(function() {
  let breakdownTable = $("#id-breakdown");

  class AttentionMonsterDB {
    constructor(name) {
      this.IDLE_MAX_ACCOUNTABLE = 60 * 1000; // milliseconds

      this.db = new Dexie(name);
      this.db.version(1).stores({
        // schema is expected to specify only indexed fields
        events: "++id, type, time, domain", // + window, audible
        icons: "domain" // + icon
      });
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
      return this.db.icons
        .toArray(items => {
          let iconLookup = {};
          items.forEach(function(element) {
            iconLookup[element.domain] = element.icon;
          }, this);
          return iconLookup;
        })
        .then(iconLookup => {
          return this.db.events
            .where("time")
            .between(start, end)
            .toArray(items => {
              let results = {};
              console.log("items to account", items.length);
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
                results[domain].totalTimeWords = moment
                  .duration(results[domain].totalTime)
                  .humanize();
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
  }

  let db = new AttentionMonsterDB("attention-monster");

  let start = new Date(2017, 9, 4);
  start.setHours(0, 0, 0, 0);
  let end = new Date(2017, 9, 4);
  end.setHours(23, 59, 59, 999);
  console.log(start, end);

  db.onScreenTimeReport(start.getTime(), end.getTime()).then(data => {
    data.forEach(function(record) {
      breakdownTable.append(
        `
        <tr>
            <td><img width="16" src="${record.icon}" /></td>
            <td>${record.domain}</td>
            <td>${record.totalTimeWords}</td>
        </tr>
        `
      );
    }, this);
  });
});
