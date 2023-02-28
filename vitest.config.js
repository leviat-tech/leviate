import { defineConfig } from 'vitest/config';
import path from 'path';

console.log(path.resolve(__dirname));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
});
