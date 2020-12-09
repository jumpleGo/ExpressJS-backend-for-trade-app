const {Schema, model} = require('mongoose')

const settings = new Schema({
  minAmount: {
    type: Number,
    required: true
  },
  minAmountUpBalance: {
    type: Number,
    required: true
  },
  allDepositsAmount: {
    type: Number,
    required: true
  }
})

module.exports = model('Setting', settings) 