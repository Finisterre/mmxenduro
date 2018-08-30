'use strict'

const fs = require('fs')

module.exports = () => {
  const TEMPLATES_PATH = './templates'
  let configContents = null

  try {
    configContents = fs.readFileSync('./cms/global/global.js', 'utf-8')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  configContents = configContents.replace(/\(|\)/g, '')
  const config = JSON.parse(configContents)

  let templates = []

  try {
    templates = fs.readdirSync(TEMPLATES_PATH)
  } catch (err) {
    console.error(err)
  }

  for (const b of config.brands) {
    const brandDirPath = './pages/generators/' + b.brandSlug

    try {
      if (!fs.existsSync(brandDirPath)) {
        fs.mkdirSync(brandDirPath)
      }

      for (const t of templates) {
        fs.copyFileSync(TEMPLATES_PATH + `/${t}`, brandDirPath + `/${t}`)
      }
    } catch (err) {
      console.error(err.message)
    }
  }
}
