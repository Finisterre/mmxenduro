'use strict'

const express = require('express')
const rp = require('request-promise')

const ss = require('../../services/simulation')

const router = express.Router()
const host = process.env.NMF_HOST

router.post('/flows/:flow', (req, res) => {
  const flow = req.params.flow
  const endpoint = process.env.NMF_ENDPOINT_FLOWS.replace(':flow', flow)
  const body = req.body

  const options = {
    method: 'post',
    uri: host + endpoint,
    headers: {
      'accept': process.env.NMF_HEADER_ACCEPT,
      'content-type': process.env.NMF_HEADER_CONTENT_TYPE,
      'x-chicken-key': process.env.NMF_HEADER_X_CHICKEN_KEY
    },
    body: body,
    json: true
  }

  rp(options)
    .then(() => {
      const id = body.id
      delete body.id

      ss
        .findOneAndUpdate({ _id: id }, body)
        .then(doc => {
          if (doc === null) {
            doc = {
              status: 200,
              detail: 'Document not found. Data was successfully sent to NMF.'
            }
          }

          res.send(doc)
        })
        .catch(err => {
          console.error(err.message)
          res.sendStatus(500)
        })
    })
    .catch(err => {
      console.error(err.message)
      res.sendStatus(err.statusCode)
    })
})

module.exports = router
