// const plugincamera = require('./index')
import plugincamera from './index.js'

class CamerasController {
  constructor (io) {
    plugincamera.setIO(io)
    this.isactive = false
    // plugincamera.init();
    if (this.isactive) {
      io.sockets.on('connection', function (socket) {
        for (const i in plugincamera.cameras) {
          const camera = plugincamera.cameras[i]
          socket.on(camera.name + '.start', function (name) {
            plugincamera.startByName(name)
          })
          socket.on(camera.name + '.stop', function (name) {
            plugincamera.stopByName(name)
          })
        }
      })
    }
  }

  getView (req, res) {
    const dataView = {
      type: 'listItem',
      itemType: 'PluginCameraItem',
      items: [],
    }
    for (const i in plugincamera.cameras) {
      dataView.items.push({
        name: plugincamera.cameras[i].name,
        data: plugincamera.cameras[i].start,
      })
    }
    res.end(JSON.stringify(dataView))
  }

  postAction (req, res) {
    res.end(JSON.stringify({}))
  }
}

export default CamerasController
// module.exports = CamerasController
