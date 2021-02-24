import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import basicAuth from 'express-basic-auth'

import { logHttp } from './util/logger.js'

export const apiPrefix = '/api'

const isTest = process.env.NODE_ENV === 'test'

const app = express()

app.use((req, res, next) => {
  res.header('x-powered-by', 'The World')
  next()
})

if (!isTest) {
  app.use(logHttp)
}

app.use(cors())
app.use(bodyParser.json({ extended: true }))
app.use(basicAuth({
  users: { [process.env.SERVER_USERNAME]: process.env.SERVER_PASSWORD },
  challenge: true,
  realm: 'Imb4T3st4pp',
}))

process.title = 'server-api'

export default app
