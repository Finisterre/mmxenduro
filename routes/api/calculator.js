'use strict'

const express = require('express')
const rp = require('request-promise')

const router = express.Router()
const host = process.env.CALCULATOR_HOST

router.get('/', (req, res) => {
  const options = {
    uri: host,
    qs: {
      income: req.query.income,
      gender: req.query.gender,
      cdi: req.query.cdi
    },
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
