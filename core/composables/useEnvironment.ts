enum SUBDOMAIN {
  TEST = 'test',
  STAGE = 'stage',
  // Technically not a subdomain, but the first segment of the url
  PROD = 'leviatdesignstudio',
}

interface Env {
  isDev: boolean;
  isCypress: boolean;
  isLdsTest: boolean;
  isLdsStage: boolean;
  isLdsProd: boolean;
}

enum ENV_LEVEL {
  DEV,
  CYPRESS,
  LDS_TEST,
  LDS_STAGE,
  LDS_PROD,
}

function getCurrentEnvLevel(env: Env) {
  if (env.isLdsProd) return ENV_LEVEL.LDS_PROD;
  if (env.isLdsStage) return ENV_LEVEL.LDS_STAGE;
  if (env.isLdsTest) return ENV_LEVEL.LDS_TEST;
  if (env.isCypress) return ENV_LEVEL.CYPRESS;
  return ENV_LEVEL.DEV;
}

export default function useEnvironment() {
  const subdomain: typeof SUBDOMAIN | string = window.location.hostname.split('.')[0];

  const env = {
    isDev: import.meta.env.DEV,
    isCypress: !!window.Cypress,
    isLdsTest: subdomain === SUBDOMAIN.TEST,
    isLdsStage: subdomain === SUBDOMAIN.STAGE,
    isLdsProd: subdomain === SUBDOMAIN.PROD,
  };

  const currentEnvLevel = getCurrentEnvLevel(env);

  return {
    ENV_LEVEL,
    ...env,
    currentEnvLevel,
  };
}
