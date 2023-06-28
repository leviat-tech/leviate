import baseConfig from './base.config';
import appConfig from '@/leviate.config';
import { createApp } from './createApp';


const isStandalone = (window === window.parent);

/**
 * Lazy load host mock in local dev and hosted staging environments
 * @return {Promise<null|(function(): void)|*>}
 */
async function getAppCreatedHandler() {
  if (!isStandalone) return null;

  const mockConfig = await import('@/mock.config');
  const { useMock } = await import('./host-mock');
  const { initialize } = useMock();
  return () => {
    initialize(mockConfig.default, baseConfig.locales);
  };
}

async function getRootComponent() {
  const rootComponentModule = isStandalone && import.meta.env.VITE_DEPLOY_TYPE !== 'standalone'
    ? await import('./components/Dev.vue')
    : await import('./components/App.vue');

  return rootComponentModule.default;
}

async function start() {
  const onAppCreated = await getAppCreatedHandler();
  const rootComponent = await getRootComponent();
  const projectConfig = { ...baseConfig, ...appConfig, onAppCreated };

  createApp(projectConfig, rootComponent, isStandalone);
}

start();
