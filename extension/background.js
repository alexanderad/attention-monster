"use strict";

class Logger {
  log(...args) {
    console.log(new Date().toISOString(), ...args);
  }
}

class AttentionMonsterListener {
  constructor(logger, db) {
    this.log = logger.log;
    this.db = db;
  }

  subscribeToBrowserEvents() {
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard/index.html")
      });
    });

    chrome.runtime.onMessage.addListener(this.receiveReport.bind(this));
  }

  parseURL(url) {
    let parser = document.createElement("a");
    parser.href = url;
    return parser.hostname;
  }

  receiveReport(report, sender) {
    let event = {
      type: report.type,
      time: Date.now(),
      window: sender.tab.windowId,
      domain: this.parseURL(sender.tab.url),
      icon: sender.tab.favIconUrl,
      audible: sender.tab.audible
    };
    this.recordEvent(event);
  }

  recordEvent(event) {
    this.db.transaction("rw", this.db.events, this.db.icons, function() {
      let icon = {
        icon: event.icon,
        domain: event.domain
      };
      delete event["icon"];

      this.db.events.add(event);
      if (icon.icon !== undefined) {
        this.db.icons.put(icon);
      }
    });
  }

  run() {
    this.subscribeToBrowserEvents();
  }
}

class AttentionMonsterDB {
  constructor(name) {
    this.IDLE_MAX_ACCOUNTABLE = 120 * 1000; // milliseconds

    this.db = new Dexie(name);
    this.db.version(1).stores({
      // schema is expected to specify only indexed fields
      events: "++id, type, time, domain", // + window, audible
      icons: "domain" // + icon
    });
  }

  onScreenTimeReport(start, end, intervals) {
    let withIntervals = intervals !== undefined;
    /*
    Returns array sorted by total time
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
    let items = {};
    let sortedItems = [];
    let events = this.db.events
      .where("time")
      .between(start, end)
      .each(function(event) {
        console.log("got event", event);
      });
    return sortedItems;
  }
}

let logger = new Logger();
let db = new AttentionMonsterDB("attention-monster");
let dbRaw = db.db;

let start = new Date();
start.setHours(0, 0, 0, 0);
let end = new Date();
end.setHours(23, 59, 59, 999);
db.onScreenTimeReport(start.getTime(), end.getTime());

let listener = new AttentionMonsterListener(logger, dbRaw);
listener.run();

// report some stats
dbRaw.events.count(count => console.log("Events in database:", count));
dbRaw.icons.count(count => console.log("Icons in database:", count));
