'use strict'

const express = require('express')
const fs = require('fs')

const router = express.Router()

const config = parseFileContents('global')

for (const b of config.brands) {
  // Only for the homepages.
  const re = new RegExp(`^\/${b.brandSlug}\/home/info$`)

  router.get(re, (req, res) => {
    const data = parseFileContents(b.brandSlug)

    enduro.api.temper
      .render(`generators/${req.originalUrl}`, data)
      .then(output => {
        res.send(output)
      })
      .catch(err => {
        console.error(err.message)
        res.sendStatus(404)
      })
  })
}

module.exports = router

function parseFileContents (fileName) {
  let fileContents = null

  try {
    fileContents = fs.readFileSync(`./cms/global/${fileName}.js`, 'utf-8')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  fileContents = fileContents.replace(/\(|\)/g, '')
  const data = JSON.parse(fileContents)

  return data
}
