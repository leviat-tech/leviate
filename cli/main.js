import commands from './commands/index.js'
import packageJSON from '../package.json';
import { parseOptions } from './helpers';

const argv = process.argv.slice(2)
const command = argv[0];
const options = parseOptions(argv.slice(1));

process.env.leviate_version = packageJSON.version

commands(command, options)
