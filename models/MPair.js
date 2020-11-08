const {Schema, model} = require('mongoose')

const pair = new Schema({
  _id: {
    type: String,
    required: true
  },
  id: {
    type: String,
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
})

module.exports = model('Pair', pair) 