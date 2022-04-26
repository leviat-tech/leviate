export const pressAnyKey = async () => {
  console.log('Press any key to continue...')

  process.stdin.setRawMode(true)

  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve();
  }))
}

export const parseOptions = (options) => {
  const rxNumbersOnly = /^\d+$/;

  return options.reduce((options, option, i) => {
    if (option.slice(0, 2) !== '--') return { ...options, [i]: option };

    const [key, val] = option.replace('--', '').split('=');

    if (val === undefined) return { ...options, [key]: true };

    if (rxNumbersOnly.test(option)) return { ...options, [key]: parseInt(val) };

    return { ...options, [key]: val };
  }, {})
}