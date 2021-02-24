import http from 'http'

import { getPort, startServer, handleExit, DEFAULT_PORT, exitGracefuly } from './server.js'
import { getConnection, closeConnections } from './connect.js'
import { techLogger } from './util/logger.js'

jest.mock('http')
jest.mock('./app.js')
jest.mock('./connect.js')
jest.mock('./util/logger.js')

describe('Server', () => {
  beforeEach(() => {
    closeConnections.mockClear()
    techLogger.error.mockClear()
    getConnection.mockClear()
    http.createServer.mockClear()
  })

  it(`Should return ${DEFAULT_PORT}`, () => {
    // When
    const port = getPort()

    // Then
    expect(port).toBe(DEFAULT_PORT)
  })

  it('Should call process.on 4 times', () => {
    // Given
    const processOn = jest.spyOn(process, 'on')

    // When
    handleExit()

    // Then
    expect(processOn.mock.calls).toHaveLength(4)
  })

  it('Should getConnection', async () => {
    // When
    await startServer().catch(error => console.warn(error))

    // Then
    expect(getConnection.mock.calls).toHaveLength(1)
    expect(http.createServer.mock.calls).toHaveLength(1)
  })

  it('Should throw error', async () => {
    // Given
    getConnection.mockReturnValueOnce(Promise.reject(new Error('This is OK!')))

    // When
    await startServer().catch(error => console.warn(error))

    // Then
    expect(getConnection.mock.calls).toHaveLength(1)
    expect(http.createServer.mock.calls).toHaveLength(0)
  })

  it('Should call closeConnections with no parameters', async () => {
    // Given
    process.exit = jest.fn()

    // When
    await exitGracefuly()

    // Then
    expect(closeConnections.mock.calls).toHaveLength(1)
    expect(closeConnections.mock.calls[0]).toHaveLength(0)
    expect(techLogger.error.mock.calls).toHaveLength(0)
  })

  it('Should log an error', async () => {
    // Given
    process.exit = jest.fn()

    // When
    await exitGracefuly(new Error())

    // Then
    expect(closeConnections.mock.calls).toHaveLength(1)
    expect(closeConnections.mock.calls[0]).toHaveLength(0)
    expect(techLogger.error.mock.calls).toHaveLength(1)
    expect(techLogger.error.mock.calls[0][0]).toBeInstanceOf(Error)
  })
})
