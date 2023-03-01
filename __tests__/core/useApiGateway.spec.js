import { useApiGateway, instance } from '@/core/composables/useApiGateway';

const mockPost = vi.spyOn(instance, 'post');
mockPost.mockImplementation(vi.fn());

const postData = { foo: 'bar' };

describe('useApiGateway', () => {
  describe('single-path endpoint with no additional path specified', () => {
    it('should post to the endpoint base if no path is given', () => {
      const api = useApiGateway('test-api');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api', postData, undefined);
    });

    it('should post to the endpoint with a leading slash', () => {
      const api = useApiGateway('/test-api');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api', postData, undefined);
    });

    it('should post to the endpoint with a trailing slash', () => {
      const api = useApiGateway('test-api/');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api', postData, undefined);
    });

    it('should post to the endpoint with a leading and trailing slash', () => {
      const api = useApiGateway('/test-api/');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api', postData, undefined);
    });
  });

  describe('multi-path endpoint with no additional path specified', () => {
    it('should post to the endpoint base if no path is given', () => {
      const api = useApiGateway('test-api/test-subpath');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath', postData, undefined);
    });

    it('should post to the endpoint with a leading slash', () => {
      const api = useApiGateway('/test-api/test-subpath');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath', postData, undefined);
    });

    it('should post to the endpoint with a trailing slash', () => {
      const api = useApiGateway('test-api/test-subpath/');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath', postData, undefined);
    });

    it('should post to the endpoint with a leading and trailing slash', () => {
      const api = useApiGateway('/test-api/test-subpath/');

      api.post(postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath', postData, undefined);
    });
  });

  describe('single-path endpoint, with additional paths specified', () => {

    it('should join the base and path with a slash', () => {
      const api = useApiGateway('test-api');

      api.post('a', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/a', postData, undefined);
    });

    it('should join subsequent subpaths with an encoded slash', () => {
      const api = useApiGateway('test-api');

      api.post('/a/b/c/', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/a%2Fb%2Fc', postData, undefined);
    });

    it('should strip a slash if the base ends and the path begins with a slash', () => {
      const api = useApiGateway('test-api/');

      api.post('/a/b/c/', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/a%2Fb%2Fc', postData, undefined);
    });
  });

  describe('multi-path endpoint, with additional paths specified', () => {

    it('should join the base and path with a slash', () => {
      const api = useApiGateway('test-api/test-subpath');

      api.post('a', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath/a', postData, undefined);
    });

    it('should join subsequent subpaths with an encoded slash', () => {
      const api = useApiGateway('test-api/test-subpath');

      api.post('/a/b/c/', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/test-subpath/a%2Fb%2Fc', postData, undefined);
    });

    it('should strip a slash if the base ends and the path begins with a slash', () => {
      const api = useApiGateway('test-api/test-subpath/');

      api.post('/a/b/c/', postData);

      expect(instance.post).toHaveBeenCalledWith('test-api/a%2Fb%2Fc', postData, undefined);
    });
  });
})
