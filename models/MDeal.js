const {Schema, model} = require('mongoose')

const deal = new Schema({
  pair: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
})

module.exports = model('Deal', deal) 