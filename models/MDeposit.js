const {Schema, model} = require('mongoose')

const deposit = new Schema({
  created_at: {
    type: Date,
    default: new Date()
  },
  timestamp: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  cryptoAmount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  partnerEaring: {
    type: Number,
    default: 0
  },
  promocode: {
    type: String,
    default: ''
  }
})

module.exports = model('Deposit', deposit) 