'use strict'

const fs = require('fs')
const rp = require('request-promise')

module.exports = () => {
  const CMS_GLOBAL_PATH = './cms/global'
  const CMS_GENERATORS_PATH = './cms/generators'
  let configContents = null

  try {
    configContents = fs.readFileSync(CMS_GLOBAL_PATH + '/global.js', 'utf-8')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  configContents = configContents.replace(/\(|\)/g, '')
  const config = JSON.parse(configContents)

  const host = process.env.SKRILLEX_HOOKS_HOST
  const options = { json: true }

  for (const b of config.brands) {

    const endpoint = process.env.SKRILLEX_HOOKS_ENDPOINT_PRICES
      .replace(':brand', b.brandId)
   
    options.uri = host + endpoint

    rp(options)
      .then(body => {
        const brandDirPath = CMS_GENERATORS_PATH + `/${b.brandSlug}`
        const modelDirPath = brandDirPath + '/model'
        
        body.brand.dealer  = b.dealer
        body.brand.company = b.company
        body.title = "Planes y Financiaciones"
        
        try {
          fs.writeFileSync(
            CMS_GLOBAL_PATH + `/${b.brandSlug}.js`,
            '(' + JSON.stringify(body) +')'
          )

          if (!fs.existsSync(brandDirPath)) {
            fs.mkdirSync(brandDirPath)
          }

          if (!fs.existsSync(modelDirPath)) {
            fs.mkdirSync(modelDirPath)
          }
        } catch (err) {
          console.error(err.message)
        }


        for (const d of config.info){

          
            try{ 
              var formData  = {
                brand:{
                      slug: b.brandSlug,
                      niceName : b.brandName,
                      dealer :  b.dealer,
                      company : b.company
                      },
                title : d.title 
              }
                  
              fs.writeFileSync(
        
                CMS_GENERATORS_PATH + `/${b.brandSlug}/${d.path}.js`,
                    '('+JSON.stringify(formData) +')'
              )
  
            }catch(err){
              console.log(err.message)
            }

        }

             
        

        for (const m of body.model) {
          m.brand_slug = b.brandSlug
          // Prevents conflict with Handlebars, `slug` is a reserved word.
          m.model_slug = m.slug
          m.dealer = b.dealer
          m.versions = []

          for (const v of body.version) {
            if (v.model === m.id) {
              m.versions.push(v)
            }
          }

          try {
            fs.writeFileSync(
              CMS_GENERATORS_PATH + `/${m.brand_slug}/model/${m.slug}.js`,
              '(' + JSON.stringify(m) + ')'
            )
            
          } catch (err) {
            console.error(err.message)
          }
        }
      })
      .catch(err => {
        console.error(err.message)
      })
  }
}
