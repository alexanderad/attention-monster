class Logger {
  log(...args) {
    console.log(new Date().toISOString(), ...args);
  }
}

const logger = new Logger();
export default logger;
