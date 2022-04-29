export default {
  mock: jest.fn(),
  attach() {
    return {
      call: {
        authorizedPostRequest: jest.fn()
      }
    }
  }
}