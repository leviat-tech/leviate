const axios = require('axios');
const logger = require('../extensions/logger.js');

async function fetchProxyAccessToken() {
  const url = 'https://crh.eu.auth0.com/oauth/token';
  const audience = 'https://crh-host-proxy.herokuapp.com';
  const grant_type = 'client_credentials';
  const res = await axios.post(url, {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience,
    grant_type,
  }).catch((e) => {
    logger.warn('Error fetching VITE_PROXY_ACCESS_TOKEN. API requests may fail.');
  });

  return res?.data.access_token;
}

function createFetchProxyAccessTokenPlugin() {
  return {
    name: 'createFetchAccessToken',
    async config(config, env) {
      if (env.mode === 'development') {
        process.env.VITE_PROXY_ACCESS_TOKEN = await fetchProxyAccessToken();
      }
    },
  };
}

module.exports = {
  fetchProxyAccessToken,
  createFetchProxyAccessTokenPlugin,
}
