'use strict'

const express = require('express')

const Simulation = enduro.mongo.model('Simulation')

const router = express.Router()

router.post('/simulations', (req, res) => {
  const simulation = new Simulation({
    body: req.body,
    created_at: new Date()
  })

  simulation
    .save()
    .then(doc => {
      res
        .status(201)
        .send(doc)
    })
    .catch(err => {
      console.error(err.message)
      res.sendStatus(500)
    })
})

module.exports = router
