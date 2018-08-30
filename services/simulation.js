'use strict'

const moment = require('moment')
const rp = require('request-promise')

const Simulation = enduro.mongo.model('Simulation')

module.exports = {
  findOneAndUpdate: (query, body) => {
    const stmt = {
      body: body,
      sent: true,
      sent_by: 'user',
      sent_at: new Date()
    }

    return Simulation
      .findOneAndUpdate(query, { $set: stmt }, { new: true })
      .exec()
  },

  updateOnTimeout: flow => {
    Simulation
      .find({ sent: false })
      .exec()
      .then(docs => {
        if (docs.length > 0) {
          const host = process.env.NMF_HOST
          const endpoint = process.env.NMF_ENDPOINT_FLOWS.replace(':flow', flow)

          const options = {
            method: 'post',
            uri: host + endpoint,
            headers: {
              'accept': process.env.NMF_HEADER_ACCEPT,
              'content-type': process.env.NMF_HEADER_CONTENT_TYPE,
              'x-chicken-key': process.env.NMF_HEADER_X_CHICKEN_KEY
            },
            json: true
          }

          for (const el of docs) {
            const now = moment()
            const diff = now.diff(el.created_at, 'seconds')

            if (diff > process.env.SIMULATION_TIMEOUT) {
              options.body = el.body

              rp(options)
                .then(() => {
                  const stmt = {
                    sent: true,
                    sent_by: 'system',
                    sent_at: now.toDate()
                  }

                  Simulation
                    .update({ _id: el._id }, { $set: stmt })
                    .exec()
                    .catch(err => {
                      console.error(err.message)
                    })
                })
                .catch(err => {
                  console.error(err.message)
                })
            }
          }
        }
      })
      .catch(err => {
        console.error(err.message)
      })
  }
}
