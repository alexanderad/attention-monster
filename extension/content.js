"use strict";

class AttentionMonsterReporter {
  constructor() {
    this.WHEEL_SENSITIVITY = 2000; // ms
    this.KEYPRESS_SENSITIVITY = 1000; // ms
    this.DEBUG = true;
  }

  log(...args) {
    if (this.DEBUG) {
      console.log("[Attention Monster Reporter]", ...args);
    }
  }

  processEvent(e) {
    if (e.type == "wheel") {
      return { type: "marker", subType: "wheel" };
    }
    if (e.type == "keypress") {
      return { type: "marker", subType: "keypress" };
    }
  }

  sendReport(e) {
    let message = this.processEvent(e);
    chrome.runtime.sendMessage(message);
    this.log("sent message", message);
  }

  listen() {
    window.addEventListener(
      "wheel",
      _.throttle(this.sendReport.bind(this), this.WHEEL_SENSITIVITY, {
        leading: false,
        trailing: true
      })
    );
    window.addEventListener(
      "keypress",
      _.throttle(this.sendReport.bind(this), this.KEYPRESS_SENSITIVITY, {
        leading: false,
        trailing: true
      })
    );
  }
}

let reporter = new AttentionMonsterReporter();
reporter.listen();
