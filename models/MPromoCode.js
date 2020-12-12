const {Schema, model} = require('mongoose')

const promocode = new Schema({
  type: {
    type: String,
    default: 'BALANCE'
  },
  value: {
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