import baseConfig from './base.config';
import appConfig from '@/leviate.config';
import mockConfig from '@/mock.config';
import { createApp } from './createApp';
import Dev from './components/Dev.vue';
import { useMock } from './host-mock';

const onAppCreated = () => useMock(import.meta.env.VITE_PROXY_ACCESS_TOKEN, mockConfig, baseConfig.locales);

const projectConfig = { ...baseConfig, ...appConfig, onAppCreated }

createApp(projectConfig, Dev);
