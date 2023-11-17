import { defineConfig } from 'vitest/config';
import path from 'path';

class TestSequencer {
  // Ensure init test runs first so we can run tests on installed files
  sort(tests) {
    return tests.sort((filePath) => {
      return filePath.includes('init.spec.js') ? -1 : 1;
    })
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname, 'template/project'),
    },
  },
  test: {
    sequence: {
      sequencer: TestSequencer
    },
    environment: 'jsdom',
    globals: true,
  }
});
