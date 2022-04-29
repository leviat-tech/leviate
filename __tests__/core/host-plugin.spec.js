import HostPlugin, { api, useHost } from '@/core/plugins/host';
import { useMock } from '@/core/host-mock';

useMock(null, {});

function installHost(endpointBase) {
  HostPlugin.install({ prototype: {} }, {
    endpoints: {
      test: endpointBase
    }
  });
}

const postData = { foo: 'bar' };

describe('Host plugin', () => {
  describe('api', () => {
    let mockPost;

    beforeEach(() => {
      mockPost = useHost().authorizedPostRequest;
    })

    it ('should post to the endpoint base if no path is given', () => {
      installHost('https://example.com');

      api.test(postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com', postData, undefined);
    });

    it ('should post to the endpoint with a trailing slash', () => {
      installHost('https://example.com/');

      api.test(postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/', postData, undefined);
    });

    it ('should join the base and path if the path starts with a slash', () => {
      installHost('https://example.com');

      api.test('/test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });

    it ('should join the base and path if the base ends with a slash', () => {
      installHost('https://example.com/');

      api.test('test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });

    it ('should strip a slash if the base ends and the path begins with a slash', () => {
      installHost('https://example.com/');

      api.test('/test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });
  })
})