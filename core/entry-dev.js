import baseConfig from './base.config';
import appConfig from '@/leviate.config';
import { createApp } from './createApp';


const isStandalone = window.self === window.top;

async function getAppcreatedHandler() {
  if (!isStandalone) return null;

  if (isStandalone) {
    const mockConfig = await import('@/mock.config');
    const { useMock } = await import('./host-mock');
    return () => {
      useMock(import.meta.env.VITE_PROXY_ACCESS_TOKEN, mockConfig.default, baseConfig.locales);
    };
  }
}

async function getRootComponent() {
  const rootComponentModule = isStandalone
    ? await import('./components/Dev.vue')
    : await import('./components/App.vue');

  return rootComponentModule.default;
}

async function start() {
  const onAppCreated = await getAppcreatedHandler();
  const rootComponent = await getRootComponent();
  const projectConfig = { ...baseConfig, ...appConfig, onAppCreated };

  createApp(projectConfig, rootComponent, isStandalone);
}

start();
