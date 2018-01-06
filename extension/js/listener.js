import debounce from "../third-party/js/debounce.min.js";

class Listener {
  /**
   * Listens to user activity in browser and sends out
   * filtered events to collector.
   */
  constructor() {
    this.WHEEL_SENSITIVITY = 1000; // ms
    this.KEYPRESS_SENSITIVITY = 1000; // ms
    this.MOUSE_SENSITIVITY = 1000; // ms
  }

  sendReport(e) {
    chrome.runtime.sendMessage({ type: e.type });
  }

  listen() {
    window.addEventListener(
      "wheel",
      debounce(this.sendReport.bind(this), this.WHEEL_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
    window.addEventListener(
      "keypress",
      debounce(this.sendReport.bind(this), this.KEYPRESS_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
    window.addEventListener(
      "mousedown",
      debounce(this.sendReport.bind(this), this.MOUSE_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
  }
}

var listener = new Listener();
listener.listen();
