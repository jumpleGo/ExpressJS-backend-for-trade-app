const {Schema, model} = require('mongoose')

const settings = new Schema({
  minAmountForWithdrawal: {
    type: Number,
    required: true
  },
  minAmountForUp: {
    type: Number,
    required: true
  },
  allDepositsForWithdrawal: {
    type: Number,
    required: true
  }
})

module.exports = model('Setting', settings) 