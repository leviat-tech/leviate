import { white, red, yellow } from 'ansi-colors'

const prefix = 'leviate: ';
const log = (msg, color = white, level = 'info') => {
  console.log(color(`leviate [${level}]: ${msg}`));
}

export default {

  error(msg) {
    log(msg, red, 'error');
  },
  warn(msg) {
    log(msg, yellow, 'warn');
  },
  log
}
