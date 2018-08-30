'use strict'

const rp = require('request-promise')

module.exports = app => {
  const host = process.env.SISYPHUS_HOST
  const endpoint = process.env.SISYPHUS_ENDPOINT_JWT_SIGN

  const options = {
    method: 'post',
    uri: host + endpoint,
    headers: {
      'content-type': process.env.SISYPHUS_HEADER_CONTENT_TYPE,
      'username': process.env.SISYPHUS_HEADER_USERNAME,
      'password': process.env.SISYPHUS_HEADER_PASSWORD
    },
    json: true
  }

  rp(options)
    .then(body => {
      app.set('sisyphus-token', body.data.token)
    })
    .catch(err => {
      console.error(err.message)
      app.set('sisyphus-token', null)
    })
}
