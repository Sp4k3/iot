export const getConnection = jest.fn(
  () => Promise.resolve(),
)

export const exitGracefuly = jest.fn()

export const closeConnections = jest.fn()
