const {Schema, model} = require('mongoose')

const candle = new Schema({
  timestampMs: {
    type: Number,
    required: true
  },
  base: {
    type: String,
    required: true
  },
  low: {
    type: String,
    required: true
  },
  high: {
    type: String,
    required: true
  },
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
})

module.exports = model('Candle', candle) 