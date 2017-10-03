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
      subType: report.subType,
      time: Date.now(),
      page: {
        window: sender.tab.windowId,
        domain: this.parseURL(sender.tab.url),
        icon: sender.tab.icon,
        audible: sender.tab.audible
      }
    };
    this.recordEvent(event);
  }

  recordEvent(event) {
    this.db.transaction("rw", this.db.events, function() {
      this.db.events.add(event);
    });
  }

  run() {
    this.subscribeToBrowserEvents();
  }
}

let logger = new Logger();

let db = new Dexie("events");
db.version(1).stores({
  events:
    "++id, type, subType, time, page.domain, page.icon, page.window, page.audible"
});

let listener = new AttentionMonsterListener(logger, db);
listener.run();

// report some stats
db.events.count(count => console.log("Events in database:", count));
navigator.storage
  .estimate()
  .then(data =>
    console.log(
      "Storage used:",
      (data.usage / 1024 / 1024).toFixed(2),
      ", available:",
      (data.quota / 1024 / 1024).toFixed(2)
    )
  );
