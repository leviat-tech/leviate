import manifest from '@@/manifest.json';

/**
 * Returns features as specified in manifest.json. If the 'level' argument is present
 * then the respective subset will be returned
 * @param { 'core' | 'project' } level
 * @return { object }
 */
export const useFeatures = (level) => {
  return level ? manifest.features[level] : manifest.features;
}

/**
 * Returns the boolean value of a project feature flag
 * @param { string } featureName
 * @return { boolean }
 */
export const useFeature = (featureName) => {
  return manifest.features.project[featureName];
}

export const FeaturesPlugin = {
  install(app) {
    app.config.globalProperties.$features = manifest.features;
  }
}
