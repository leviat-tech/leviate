const LOG_LEVELS = {
  ERROR: 1,
  WARNING: 2,
  DEBUG: 3,
}

const logLevelConfig = import.meta.env.VITE_LDS_ENV === 'prod' ? 'ERROR' : 'DEBUG';
const logLevel = LOG_LEVELS[logLevelConfig];

const log = (msg, data = '', level = 'info', requiredLogLevel = LOG_LEVELS.DEBUG) => {
  if (logLevel < requiredLogLevel) return;

  const prefix = `[LEVIATE ${level}]:`;
  const fullMessage = [prefix, msg].join(' ');
  const action = console[level];

  action(fullMessage, data);
}

export default {
  log,
  info: (msg, data) => log(msg, data, 'info', LOG_LEVELS.DEBUG),
  warn: (msg, data) => log(msg, data, 'warn', LOG_LEVELS.WARNING),
  error: (msg, data) => log(msg, data, 'error', LOG_LEVELS.ERROR),
}
