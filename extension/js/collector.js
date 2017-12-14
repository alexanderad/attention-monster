import logger from "./logger.js";
import db from "./db.js";

class Collector {
  subscribeToEvents() {
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({
        url: chrome.runtime.getURL("html/index.html")
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
    db.transaction("rw", db.events, db.icons, function() {
      let icon = {
        icon: event.icon,
        domain: event.domain
      };
      delete event["icon"];

      db.events.add(event);
      if (icon.icon !== undefined) {
        db.icons.put(icon);
      }
    });
  }

  run() {
    this.subscribeToEvents();
  }
}

var collector = new Collector();
collector.run();

db.events.count(count => logger.log("Events in database:", count));
db.icons.count(count => logger.log("Icons in database:", count));
