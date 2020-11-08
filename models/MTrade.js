const {Schema, model} = require('mongoose')

const trade = new Schema({
  price: {
    type: Number,
    required: true
  },
  unix: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  base: {
    type: String,
    required: true
  },
  side: {
    type: String,
    required: true
  },
})

module.exports = model('Trade', trade) 