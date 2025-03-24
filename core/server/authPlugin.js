async function getToken() {
  const { SERVICE_URL, LDS_CLIENT_ID, LDS_CLIENT_SECRET } = process.env;

  if (process.env.VITEST !== 'true') {if (!SERVICE_URL || !LDS_CLIENT_ID || !LDS_CLIENT_SECRET) {
    throw new Error('please ensure you have the following environment variables set:\n- SERVICE_URL\n- LDS_CLIENT_ID\n- LDS_CLIENT_SECRET');
  }}

  const url = process.env.SERVICE_URL + '/auth/get-token';
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: LDS_CLIENT_ID,
      client_secret: LDS_CLIENT_SECRET,
    })
  }).then(res => res.json());
}

function configureServer(server) {
  server.middlewares.use('/auth/get-service-token', async (req, res) => {
    try {
      const tokenResponse = await getToken();

      res.end(JSON.stringify(tokenResponse));
    } catch (e) {
      console.log('Error retrieving token:', e);
    }
  });
}

/**
 * This plugin uses locally stored client credentials
 * in order to fetch tokens that can be used to call
 * API Gateway services
 */
function tokenPlugin() {
  return {
    name: 'token-generator',
    configureServer,
    configurePreviewServer: configureServer,
  };
}

module.exports = {
  tokenPlugin,
  getToken
};
