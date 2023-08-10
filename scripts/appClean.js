const fs = require('fs-extra');
const logger = require('../cli/logger.js');

fs.readdirSync('./app').forEach(filepath => {
  if (!filepath.match(/index\.html/)) fs.remove(`./app/${filepath}`);
})
