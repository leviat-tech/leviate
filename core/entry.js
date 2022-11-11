import baseConfig from './base.config';
import appConfig from '@/leviate.config';
import { createApp } from './createApp';


const isDev = import.meta.env.DEV;

/**
 * Lazy load host mock as not needed in production
 * @return {Promise<null|(function(): void)|*>}
 */
async function getAppcreatedHandler() {
  if (!isDev) return null;

  if (isDev) {
    const mockConfig = await import('@/mock.config');
    const { useMock } = await import('./host-mock');
    return () => {
      useMock(import.meta.env.VITE_PROXY_ACCESS_TOKEN, mockConfig.default, baseConfig.locales);
    };
  }
}

async function getRootComponent() {
  const rootComponentModule = isDev
    ? await import('./components/Dev.vue')
    : await import('./components/App.vue');

  return rootComponentModule.default;
}

async function start() {
  const onAppCreated = await getAppcreatedHandler();
  const rootComponent = await getRootComponent();
  const projectConfig = { ...baseConfig, ...appConfig, onAppCreated };

  createApp(projectConfig, rootComponent, isDev);
}

start();
