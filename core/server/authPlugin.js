/**
 * This plugin uses locally stored client credentials
 * in order to fetch tokens that can be used to call
 * API Gateway services
 */
module.exports = function tokenPlugin() {
  return {
    name: 'token-generator',
    configureServer(server) {
      server.middlewares.use('/auth/get-service-token', async(req, res, next) => {
        const url = process.env.SERVICE_URL + '/auth/get-token';
        try {
          const data = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
              grant_type: 'client_credentials',
              client_id: process.env.LDS_CLIENT_ID,
              client_secret: process.env.LDS_CLIENT_SECRET,
            })
          }).then(res => res.json());

          res.end(JSON.stringify(data));
        } catch(e) {
          console.log('Error retrieving token:', e);
        }
      });
    }
  };
}
