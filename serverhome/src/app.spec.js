import request from 'supertest'
import app, { apiPrefix } from './app.js'

import pkg from '../package.json'

describe('App', () => {
  it('Should respond with the version', async () => {
    const response = await request(app)
      .get(`${apiPrefix}/version`)
      .expect(200)
    expect(response.body).toBe(pkg.version)
  })
})
