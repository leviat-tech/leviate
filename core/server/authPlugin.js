/**
 * This plugin uses locally stored client credentials
 * in order to fetch tokens that can be used to call
 * API Gateway services
 */
module.exports = function tokenPlugin() {
  return {
    name: 'token-generator',
    configureServer(server) {
      const { SERVICE_URL, LDS_CLIENT_ID, LDS_CLIENT_SECRET } = process.env;

      if (!SERVICE_URL || !LDS_CLIENT_ID || !LDS_CLIENT_SECRET) {
        throw new Error('please ensure you have the following environment variables set:\n- SERVICE_URL\n- LDS_CLIENT_ID\n- LDS_CLIENT_SECRET');
      }

      server.middlewares.use('/auth/get-service-token', async(req, res, next) => {
        const url = SERVICE_URL + '/auth/get-token';
        try {
          const responseText = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              grant_type: 'client_credentials',
              client_id: LDS_CLIENT_ID,
              client_secret: LDS_CLIENT_SECRET,
            })
          }).then(res => res.text());

          res.end(responseText);
        } catch(e) {
          console.log('Error retrieving token:', e);
        }
      });
    }
  };
}
