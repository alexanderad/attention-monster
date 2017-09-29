"use strict";

class AttentionMonsterListener {
  constructor() {
    this.DEBUG = true;
  }

  log(...args) {
    if (this.DEBUG) {
      console.log("[Attention Monster Listener]", ...args);
    }
  }

  subscribeToBrowserEvents() {
    // TODO: icon click stub
    // chrome.browserAction.onClicked.addListener(function(tab) {
    //   console.log("icon clicked!");
    // });

    chrome.runtime.onMessage.addListener(this.receiveReport.bind(this));
  }

  parseURL(url) {
    let parser = document.createElement("a");
    parser.href = url;
    return {
      domain: parser.hostname
    };
  }

  receiveReport(report, sender) {
    let page = this.parseURL(sender.tab.url);
    page.icon = sender.tab.faviconUrl;

    let event = {
      type: report.type,
      subType: report.subType,
      time: Date.now(),
      page: page,
      windowId: sender.tab.windowId,
      audible: sender.tab.audible
    };
    this.log("received event", event);
  }

  run() {
    this.subscribeToBrowserEvents();
  }
}

let listener = new AttentionMonsterListener();
listener.run();
