'use strict'

const express = require('express')
const rp = require('request-promise')

const router = express.Router()
const host = process.env.SISYPHUS_HOST

router.post('/simulations', (req, res) => {

  const endpoint = process.env.SISYPHUS_ENDPOINT_SIMULATIONS

  const options = {
    method: 'post',
    uri: host + endpoint,
    headers: {
      'content-type': process.env.SISYPHUS_HEADER_CONTENT_TYPE,
      'x-sisyphus-token': req.app.get('sisyphus-token')
    },
    body: req.body,
    json: true
  }

  rp(options)
    .then(body => {
      res.send(body)
    })
    .catch(err => {
      console.error(err.message)
      res.sendStatus(err.statusCode)
    })
})

module.exports = router
