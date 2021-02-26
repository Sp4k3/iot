import fs from 'fs'
import path from 'path'
import url from 'url'

import express from 'express'

export default (io) => {
  const router = new express.Router()

  router.get('/', (req, res) => {
    res.send('Server is running')
  })

  const __filename = url.fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const pluginsFolder = path.join(__dirname, './../plugins')
  const pluginsForMenu = []
  const plugins = []
  fs.readdir(pluginsFolder, (err, files) => {
    if (err) {
      console.log('Error : ', err)
    } else {
      files.forEach(async file => {
        const filePath = pluginsFolder + '/' + file + '/controller.js'
        if (fs.existsSync(filePath)) {
          let controller = await import(pluginsFolder + '/' + file + '/controller.js')
          controller = controller.default(io)
          if (controller.isActive) {
            console.log('Setting up plugin : ' + file)
            plugins.push(file)
            router.post('/' + file + '/action/:actionId', controller.postAction)
            if (controller.getView) {
              router.get('/' + file + '/view', controller.getView)
              pluginsForMenu.push(file)
            }
          }
        }
      })
    }
  })

  // Url to get a list of plugin view
  router.get('/plugins', (req, res) => {
    res.end(JSON.stringify(pluginsForMenu))
  })

  // Url to get all plugins expressions
  router.get('/expressions', async (req, res) => {
    const allExpression = {}
    for (let i = 0; i < plugins.length; i++) {
      const pathExpressions = pluginsFolder + '/' + plugins[i] + '/expressions.json'
      if (fs.existsSync(pathExpressions)) {
        let expressions = await import(pathExpressions)
        expressions = expressions.default
        allExpression[plugins[i]] = expressions
      }
    }
    res.end(JSON.stringify(allExpression))
  })

  // Url to get all plugins configs
  router.get('/configs', async (req, res) => {
    const allConfigs = {}
    for (let i = 0; i < plugins.length; i++) {
      const pathConfig = pluginsFolder + '/' + plugins[i] + '/config.json'
      if (fs.existsSync(pathConfig)) {
        let config = await import(pathConfig)
        config = config.default
        allConfigs[plugins[i]] = config
      }
    }
    res.end(JSON.stringify(allConfigs))
  })
  return router
}
