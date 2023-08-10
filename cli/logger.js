const { white, red, yellow } = require('ansi-colors');

const log = (msg, color = white, level = 'info') => {
  console.log(color(`leviate: [${level}]: ${msg}`));
}

module.exports = {
  error(msg) {
    log(msg, red, 'error');
  },
  warn(msg) {
    log(msg, yellow, 'warn');
  },
  log
}
