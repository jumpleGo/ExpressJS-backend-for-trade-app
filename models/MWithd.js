const {Schema, model} = require('mongoose')

const withdSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  card: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: false
  },
})

module.exports = model('Withdrawal', withdSchema) 