import HostPlugin, { api, useLocalize, useHost } from '@/core/plugins/host';
import { useMock } from '@/core/host-mock';

useMock('test-token', {}, {
  en: {
    test_phrase: 'test phrase'
  }
});

function installHost(endpointBase) {
  HostPlugin.install({
    config: {
      globalProperties: {}
    }
  }, {
    endpoints: {
      test: endpointBase
    }
  });

  const mockPost = vi.spyOn(useHost(), 'authorizedPostRequest');
  mockPost.mockImplementation(() => {});
  return mockPost;
}

const postData = { foo: 'bar' };

describe('Host plugin', () => {
  describe('api', () => {
    it('should post to the endpoint base if no path is given', () => {
      const mockPost = installHost('https://example.com');

      api.test(postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com', postData, undefined);
    });

    it('should post to the endpoint with a trailing slash', () => {
      const mockPost = installHost('https://example.com/');

      api.test(postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/', postData, undefined);
    });

    it('should join the base and path if the path starts with a slash', () => {
      const mockPost = installHost('https://example.com');

      api.test('/test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });

    it('should join the base and path if the base ends with a slash', () => {
      const mockPost = installHost('https://example.com/');

      api.test('test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });

    it('should strip a slash if the base ends and the path begins with a slash', () => {
      const mockPost = installHost('https://example.com/');

      api.test('/test-route', postData);

      expect(mockPost).toHaveBeenCalledWith('https://example.com/test-route', postData, undefined);
    });
  })

  describe('localize', () => {
    it('should translate a string exactly as defined in the locales file', () => {
      const translated = useLocalize().$l('test_phrase');

      expect(translated).toBe('test phrase');
    });

    it('should capitalise the translated string', () => {
      const translated = useLocalize().$L('test_phrase');

      expect(translated).toBe('Test Phrase');
    });
  });
});
