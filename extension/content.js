"use strict";

class AttentionMonsterReporter {
  constructor() {
    this.WHEEL_SENSITIVITY = 2000; // ms
    this.KEYPRESS_SENSITIVITY = 1000; // ms
  }

  sendReport(e) {
    chrome.runtime.sendMessage({ type: e.type });
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
