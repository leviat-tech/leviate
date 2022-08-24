import logger from '../logger';

const commands = {
  init: () => import('./init'),
  devOnly: () => import('./dev'),
  version: () => import('./version'),
  checkUpdates: () => import('./checkUpdates'),
  checkdeps: commandInDevelopment('Checks for unused dependencies'),
  checkurls: commandInDevelopment('Checks for hardcoded urls'),
  checklang: () => import('./checklang'),

  // Compound commands
  dev: ['checkUpdates', 'devOnly']
};

function commandInDevelopment(msg) {
  return () => new Promise(resolve => {
    resolve({
      default: {
        run(options) {
          console.log(msg)
          console.log('This command is still in development')
        }
      }
    })
  })
}

/**
 * Process the user's input.
 * Log a message if the command cannot be found
 * Otherwise run the command
 * @param name
 * @param options
 * @returns {void|*}
 */
export default async function processCommand(name, options) {
  if (!name) {
    return printPossibleCommands();
  }

  const command = commands[name]

  if (!command) {
    console.error(`Command ${name} not found`)
    return printPossibleCommands();
  }

  // Handle a single command
  if (typeof command === 'function') {
    const commandModule = await command();
    return runCommand(commandModule.default, options);
  }

  // Handle batch commands
  if (command instanceof Array) {
    for (const commandName of command) {
      const module = await commands[commandName]();
      await runCommand(module.default, options);
    }
  }
}

/**
 * Run the command with any given options
 * @param commandModule
 * @param options
 */
async function runCommand(commandModule, options) {
  return commandModule.run(options).catch(logger.error);
}

/**
 * Print an automatically generated list of possible commands
 */
function printPossibleCommands() {
  console.log('Usage: leviate <command> [<options>]\n');
  console.log('Possible commands:\n')
  Object.entries(commands).forEach(async ([commandStr, commandLoader]) => {
    if (commandLoader instanceof Array) {
      return console.log(`${commandStr}: [${commandLoader.join(', ')}]`);
    }

    const commandConfig = await commandLoader();
    const usage = commandConfig.default.usage || commandStr
    console.log(usage)
  })
}
