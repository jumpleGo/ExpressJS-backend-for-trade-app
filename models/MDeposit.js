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
  amount: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
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