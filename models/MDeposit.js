const {Schema, model} = require('mongoose')

const deposit = new Schema({
  created_at: {
    type: Date,
    default: new Date()
  },
  user: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

module.exports = model('Deposit', deposit) 