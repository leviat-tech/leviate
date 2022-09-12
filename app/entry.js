import baseConfig from '../core/base.config';
import appConfig from '@/leviate.config';
import mockConfig from '@/mock.config';
import { createApp } from '../core/createApp';
import Dev from '../core/components/Dev.vue';
import { useMock } from '../core/host-mock';

mockConfig.meta.configurator.name = 'Demo Application'

const onAppCreated = () => useMock(import.meta.env.VITE_PROXY_ACCESS_TOKEN, mockConfig, baseConfig.locales);

const projectConfig = { ...baseConfig, ...appConfig, onAppCreated }

createApp(projectConfig, Dev);