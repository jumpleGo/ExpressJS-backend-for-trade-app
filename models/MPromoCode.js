const {Schema, model} = require('mongoose')

const promocode = new Schema({
  type: {
    type: String,
    default: 'BALANCE'
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  code: {
    type: String,
    required: true
  },
  minDeposit: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    required: true
  }
})

module.exports = model('promocode', promocode) 