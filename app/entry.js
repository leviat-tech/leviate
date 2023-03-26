import baseConfig from '../core/base.config';
import appConfig from '@/leviate.config';
import mockConfig from '@/mock.config';
import { createApp } from '../core/createApp';
import { useMock } from '../core/host-mock';

mockConfig.meta.configurator.name = 'Demo Application'

const isStandalone = (window === window.parent);

/**
 * Lazy load host mock in local dev and hosted staging environments
 * @return {Promise<null|(function(): void)|*>}
 */
async function getAppCreatedHandler() {
  if (!isStandalone) return null;

  const mockConfig = await import('@/mock.config');
  const { useMock } = await import('../core/host-mock');
  return () => {
    useMock(mockConfig.default, baseConfig.locales);
  };
}

async function getRootComponent() {
  const rootComponentModule = import.meta.env.DEV || (isStandalone && appConfig.isHosted !== false)
    ? await import('../core/components/Dev.vue')
    : await import('../core/components/App.vue');

  return rootComponentModule.default;
}

async function start() {
  const onAppCreated = await getAppCreatedHandler();
  const rootComponent = await getRootComponent();
  const projectConfig = { ...baseConfig, ...appConfig, onAppCreated };

  createApp(projectConfig, rootComponent, isStandalone);
}

start();
