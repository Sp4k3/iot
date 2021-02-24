jest.genMockFromModule('http')

export default {
  createServer: jest.fn(
    () => {
      return {
        listen: jest.fn(),
      }
    },
  ),
}
