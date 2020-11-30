const {Schema, model} = require('mongoose')

const withdSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  card: {
    type: String,
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
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

module.exports = model('Withdrawal', withdSchema) 