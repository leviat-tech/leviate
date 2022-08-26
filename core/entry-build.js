import baseConfig from './base.config';
import appConfig from '@/leviate.config';
import { createApp } from './createApp';
import App from './components/App.vue';

const projectConfig = { ...baseConfig, ...appConfig }

createApp(projectConfig, App);
