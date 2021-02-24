import express from 'express'

import pluginsRouter from './routes.js'

const pkg = {
  version: process.env.npm_package_version,
}

export default (io) => {
  const router = new express.Router()

  router.use('/', pluginsRouter(io))

  router.get('/version', (req, res) => {
    res.status(200).json(pkg.version)
  })
  return router
}
