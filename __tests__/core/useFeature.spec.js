import { mount, config } from '@vue/test-utils';
import { useFeature, useFeatures, FeaturesPlugin } from '../../core/composables/useFeature';

// Ensure $features is available in test component templates
const mountOptions = {
  global: {
    plugins: [FeaturesPlugin],
  }
}


describe('useFeatures', () => {
  it('should return all core and project features', () => {
    const features = useFeatures();
    const keys = Object.keys(features);
    expect(keys).toEqual(['core', 'project']);
  });

  it('should return core features', () => {
    const features = useFeatures('core');
    const keys = Object.keys(features);
    expect(keys).toEqual(['versions', 'info', 'settings', 'explorer', 'output']);
  });

  it('should return project features', () => {
    const features = useFeatures('project');
    const keys = Object.keys(features);
    expect(keys).toEqual(['feature1', 'feature2']);
  });

  it('should return undefined', () => {
    const features = useFeatures('invalid');
    expect(features).toBe(undefined);
  });
});

describe('useFeature', () => {
  it('should return true for feature1', () => {
    const isFeature1Enabled = useFeature('feature1');

    expect(isFeature1Enabled).toBe(true);
  });

  it('should return false for feature2', () => {
    const isFeature2Enabled = useFeature('feature2');

    expect(isFeature2Enabled).toBe(false);
  });

  it('should return undefined', () => {
    const isMissingFeatureEnabled = useFeature('invalid');

    expect(isMissingFeatureEnabled).toBe(undefined);
  });
});

describe('$features in vue templates', () => {
  it ('should render content if the feature is enabled', () => {
    const component = {
      template: '<div v-if="$features.project.feature1">HELLO WORLD</div>'
    };

    const wrapper = mount(component, mountOptions);
    const el = wrapper.find('div');

    expect(el.exists()).toBe(true);

  });

  it ('should not render content if the feature is disabled', () => {
    const component = {
      template: '<div v-if="$features.project.feature2">HELLO WORLD</div>'
    };

    const wrapper = mount(component, mountOptions);
    const el = wrapper.find('div');

    expect(el.exists()).toBe(false);
  });
});
