import fs from 'fs-extra'
import init from '../../cli/commands/init'
import path from 'path';

vi.mock('enquirer');

beforeAll(async () => {
  fs.removeSync('.cwd')
})

afterAll(async () => {
  // new package hasn't been published yet so ensure
  // that the test project includes the latest core files
  const root = path.resolve(__dirname, '../../');
  fs.copySync(`${root}/core`, `${root}/.cwd/project/node_modules/@crhio/leviate/core`);
})

const cwd = '.cwd';

describe.skip('init', () => {
  it('should initialize in the current directory', async () => {
    const success = await init.run();

    const packageJSON = fs.readJsonSync(cwd + '/project/package.json');

    expect(success).toBe(true);
    expect(packageJSON).toHaveProperty('name', 'my-awesome-application');
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });

  it('should initialize in a new project directory', async () => {
    const dirname = 'my-project';
    const success = await init.run([dirname]);

    const packageJSON = fs.readJsonSync(`${cwd}/${dirname}/project/package.json`);

    expect(success).toBe(true);
    expect(packageJSON).toHaveProperty('name', dirname);
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });

  it('should prevent initializing a new project in an existing directory', async () => {
    const dirname = 'my-project';
    const success = await init.run([dirname]);

    const packageJSON = fs.readJsonSync(`${cwd}/${dirname}/project/package.json`);

    expect(success).toBe(false);
    expect(packageJSON).toHaveProperty('name', dirname);
    expect(packageJSON).toHaveProperty('version', '0.0.1');
  });
});
