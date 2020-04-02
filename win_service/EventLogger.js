const { title } = require('../package.json');
const EventLogger = require('node-windows').EventLogger;

const log = new EventLogger(title);

module.exports = {
  info(message) {
    console.log(message);
    log.info(message);
  },
  warn(message) {
    console.log(message);
    log.info(message);
  },
  error(message) {
    console.log(message);
    log.error(message);
  }
};
