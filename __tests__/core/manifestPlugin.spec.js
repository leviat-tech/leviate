import fs from 'fs-extra';
import manifestPlugin from '@/core/server/manifestPlugin';
import logger from '../../cli/logger.js';
import { spawnSync } from 'child_process';
import semver from 'semver';

const buildPath = '.cwd/project/dist/';
const manifestPath = `${buildPath}/manifest.json`;
const updatesPath = `${buildPath}/updates.json`;

beforeAll(() => {
  // try {
  //   spawnSync(`npx vite build --force`, {
  //     cwd: '.cwd/project',
  //     stdio: 'inherit',
  //     shell: true
  //   })
  // } catch (e) {
  //   logger.error(e)
  // }
})

describe('manifestPlugin', () => {
  describe('manifest.json', () => {
    it('should create a manifest file', async () => {
      const exists = fs.existsSync(manifestPath)
      expect(exists).toBe(true);
    });

    it('should contain name, description, version, and date properties', async () => {
      const manifest = fs.readJsonSync(manifestPath);
      expect(manifest).toHaveProperty('name');
      expect(manifest).toHaveProperty('description');
      expect(manifest).toHaveProperty('version');
      expect(semver.valid(manifest.version)).toBe('0.0.1');
      expect(manifest).toHaveProperty('date');
    });
  });

  describe('updates.json', async () => {
    it('should create an updates file', async () => {
      const exists = fs.existsSync(updatesPath);
      expect(exists).toBe(true);
    });

    it('should be an array', async () => {
      const updates = fs.readJsonSync(updatesPath);
      expect(updates).toBeInstanceOf(Array);
    });

    it('should contain items with version and date properties', async () => {
      const updates = fs.readJsonSync(updatesPath);
      const latestUpdate = updates[0];

      expect(latestUpdate).toHaveProperty('version');
      expect(semver.valid(latestUpdate.version)).toBeTypeOf('string');
      expect(latestUpdate).toHaveProperty('date');
    });
  });
});