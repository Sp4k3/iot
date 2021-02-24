import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import routes from './routes/index.js'
import app from './app.js'
import { techLogger } from './util/logger.js'

export const DEFAULT_PORT = 3300
export const apiPrefix = '/api'

const port = getPort()
startServer(port)

export async function startServer (port) {
  // Create http server
  const server = http
    .createServer(app)
    .listen(port, '0.0.0.0')
  techLogger.info(`server running at http://localhost:${port}`)

  // Create socket server
  const io = new Server(server, {
    pingTimeout: 30000,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://172.21.0.1:3000',
      ],
      credentials: true,
    },
  })
  const socketAuth = await import('socketio-auth')
  socketAuth.default(io, {
    authenticate: function (socket, data, callback) {
      const username = data.username
      const password = data.password
      return callback(null, username === process.env.SERVER_USERNAME && password === process.env.SERVER_PASSWORD)
    },
  })

  app.use(apiPrefix, routes(io))
}

export function getPort () {
  dotenv.config()
  const port = process.env.SERVER_API_PORT || DEFAULT_PORT
  return +port
}
