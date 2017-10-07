/**
 * Listens to user activity in browser and sends out
 * filtered events to collector.
 */

class Listener {
  constructor() {
    this.WHEEL_SENSITIVITY = 2000; // ms
    this.KEYPRESS_SENSITIVITY = 1000; // ms
    this.MOUSE_SENSITIVITY = 1000; // ms
  }

  sendReport(e) {
    console.log("i want to send report", e);
    chrome.runtime.sendMessage({ type: e.type });
  }

  listen() {
    window.addEventListener(
      "wheel",
      this.debounce(this.sendReport.bind(this), this.WHEEL_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
    window.addEventListener(
      "keypress",
      this.debounce(this.sendReport.bind(this), this.KEYPRESS_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
    window.addEventListener(
      "mousedown",
      this.debounce(this.sendReport.bind(this), this.MOUSE_SENSITIVITY, {
        leading: false,
        trailing: true,
        maxWait: this.WHEEL_SENSITIVITY
      })
    );
  }

  /*
  * lodash.debounce: https://github.com/lodash/lodash/blob/master/debounce.js
  */
  debounce(func, wait, options) {
    let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof func != "function") {
      throw new TypeError("Expected a function");
    }
    wait = +wait || 0;
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;

    function invokeFunc(time) {
      const args = lastArgs;
      const thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      const timeSinceLastCall = time - lastCallTime;
      const timeSinceLastInvoke = time - lastInvokeTime;
      const timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      const timeSinceLastCall = time - lastCallTime;
      const timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (
        lastCallTime === undefined ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait)
      );
    }

    function timerExpired() {
      const time = Date.now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function pending() {
      return timerId !== undefined;
    }

    function debounced(...args) {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs = args;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
  }
}

var Listener = new Listener();
listener.listen();
