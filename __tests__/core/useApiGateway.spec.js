import { useApiGateway } from '@/core/composables/useApiGateway';

const mockHost = {
  makeApiGatewayRequest: (d) => {
    return { isError: false }
  }
};

vi.mock('../../core/plugins/host', () => {
  return {
    useHost: () => mockHost
  }
});


const postData = {
  foo: 'bar',
};

const callData = {
  data: postData,
  method: 'post',
  options: undefined,
}

describe('useApiGateway', () => {
  describe('single-path endpoint with no additional path specified', () => {
    it('should post to the endpoint base if no path is given', () => {
      const api = useApiGateway('test-api');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api', ...callData });
    });

    it('should post to the endpoint with a leading slash', () => {
      const api = useApiGateway('/test-api');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: '/test-api', ...callData });
    });

    it('should post to the endpoint with a trailing slash', () => {
      const api = useApiGateway('test-api/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/', ...callData });
    });

    it('should post to the endpoint with a leading and trailing slash', () => {
      const api = useApiGateway('/test-api/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: '/test-api/', ...callData });
    });
  });

  describe('multi-path endpoint with no additional path specified', () => {
    it('should post to the endpoint base if no path is given', () => {
      const api = useApiGateway('test-api/test-subpath');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/test-subpath', ...callData });
    });

    it('should post to the endpoint with a leading slash', () => {
      const api = useApiGateway('/test-api/test-subpath');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: '/test-api/test-subpath', ...callData });
    });

    it('should post to the endpoint with a trailing slash', () => {
      const api = useApiGateway('test-api/test-subpath/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/test-subpath/', ...callData });
    });

    it('should post to the endpoint with a leading and trailing slash', () => {
      const api = useApiGateway('/test-api/test-subpath/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post(postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: '/test-api/test-subpath/', ...callData });
    });
  });

  describe('single-path endpoint, with additional paths specified', () => {

    it('should join the base and path with a slash', () => {
      const api = useApiGateway('test-api');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('a', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/a', ...callData });
    });

    it('should join subsequent subpaths with an encoded slash', () => {
      const api = useApiGateway('test-api');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('/a/b/c/', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/a/b/c/', ...callData });
    });

    it('should strip a slash if the base ends and the path begins with a slash', () => {
      const api = useApiGateway('test-api/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('/a/b/c/', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/a/b/c/', ...callData });
    });
  });

  describe('multi-path endpoint, with additional paths specified', () => {

    it('should join the base and path with a slash', () => {
      const api = useApiGateway('test-api/test-subpath');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('a', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/test-subpath/a', ...callData });
    });

    it('should join subsequent subpaths with an encoded slash', () => {
      const api = useApiGateway('test-api/test-subpath');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('/a/b/c/', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/test-subpath/a/b/c/', ...callData });
    });

    it('should strip a slash if the base ends and the path begins with a slash', () => {
      const api = useApiGateway('test-api/test-subpath/');
      const makeApiGatewayRequestSpy = vi.spyOn(mockHost, 'makeApiGatewayRequest')

      api.post('/a/b/c/', postData);

      expect(makeApiGatewayRequestSpy).toHaveBeenCalledWith({ url: 'test-api/test-subpath/a/b/c/', ...callData });
    });
  });
})
