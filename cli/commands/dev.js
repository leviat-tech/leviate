import { spawn } from 'child_process';

export default {
  async run(options) {
    const dev = spawn('npm', ['run', 'dev'])

    dev.stdout.on('data', (data) => {
      process.stdout.write(data)
    });
  }
}