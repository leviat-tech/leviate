const translationPlugin = require("./plugins/translation");
const merge = require('lodash/merge');

export default function getSharedConfig(translationsName, projectConfig) {
  const sharedConfig = {
    // TODO: add shared config data
    plugins: [translationPlugin(translationsName)]
  }
  // return merged config
  return merge(sharedConfig, projectConfig)
}