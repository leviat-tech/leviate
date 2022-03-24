const commands = {
  init: () => import('./init'),
  checkdeps: commandInDevelopment('Checks for unused dependencies'),
  checkurls: commandInDevelopment('Checks for hardcoded urls'),
  checklang: () => import('./checklang')
}

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

  const commandModule = await command();
  runCommand(commandModule.default, options);
}

/**
 * Run the command with any given options
 * @param commandModule
 * @param options
 */
function runCommand(commandModule, options) {
  commandModule.run(options);
}

/**
 * Print an automatically generated list of possible commands
 */
function printPossibleCommands() {
  console.log('Possible commands:\n')
  Object.entries(commands).forEach(async ([commandStr, commandLoader]) => {
    const commandConfig = await commandLoader();
    const usage = commandConfig.default.usage || commandStr
    console.log('leviate ' + usage)
  })
}
