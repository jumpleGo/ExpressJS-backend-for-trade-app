const {Schema, model} = require('mongoose')

const referral = new Schema({
  main: {
    type: String,
    required: true
  },
  referral: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = model('RefConnection', referral) 