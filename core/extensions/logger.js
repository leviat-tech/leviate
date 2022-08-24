const log = (msg, data = '', level = 'log') => {
  const prefix = `[LEVIATE ${level}]:`;
  const fullMessage = [prefix, msg].join(' ');
  const action = console[level];

  action(fullMessage, data);
}

export default {
  log,
  info: (msg, data) => log(msg, data, 'info'),
  warn: (msg, data) => log(msg, data, 'warn'),
  error: (msg, data) => log(msg, data, 'error')
}