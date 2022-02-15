// require = require("esm")(module)
const argv = process.argv.slice(2)
const command = argv[0];
const options = argv.slice(1);

import commands from './commands/index.js'

commands(command, options)
