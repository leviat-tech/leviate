import { white, red, green, yellow } from 'ansi-colors'

const log = (msg, color = white, level = 'info') => {
  console.log(color(`[leviate]: ${msg}`));
}

export default {

  error(msg) {
    log(msg, red);
  },
  warn(msg) {
    log(msg, yellow);
  },
  success(msg) {
    log(msg, green);
  },
  log
}
