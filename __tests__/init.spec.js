import fs from 'fs-extra'
import init from '../cli/commands/init'
import { prompt } from '../__mocks__/enquirer';

let answers;

beforeAll(async() => {
  answers = await prompt();
})

afterAll(() => {
  fs.removeSync('.cwd')
})

const cwd = '.cwd';

describe('init', () => {
  it('should initialize in the current directory', async() => {
    const success = await init.run()

    const packageJSON = fs.readJsonSync(cwd + '/project/package.json');

    expect(success).toBe(true);
    expect(packageJSON).toHaveProperty('name', 'my-awesome-application');
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });

  it('should initialize in a new project directory', async() => {
    const dirname = 'my-project';
    const success = await init.run([dirname]);

    const packageJSON = fs.readJsonSync(`${cwd}/${dirname}/project/package.json`);

    expect(success).toBe(true);
    expect(packageJSON).toHaveProperty('name', dirname);
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });

  it('should prevent initializing a new project in an existing directory', async() => {
    const dirname = 'my-project';
    const success = await init.run([dirname]);

    const packageJSON = fs.readJsonSync(`${cwd}/${dirname}/project/package.json`);

    expect(success).toBe(false);
    expect(packageJSON).toHaveProperty('name', dirname);
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });
});
