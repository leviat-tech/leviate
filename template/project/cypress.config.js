const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: { testIsolation: false },
  viewportHeight: 1200,
  viewportWidth: 1600,
  video: false,
  screenshotOnRunFailure: false,
});
