import { execSync } from 'child_process';

export default {
  async run(options) {
    execSync('npm run dev', { stdio: 'inherit' });
  }
}