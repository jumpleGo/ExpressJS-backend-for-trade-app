const {Schema, model} = require('mongoose')

const partner = new Schema({
  user: {
    type: String,
    required: true
  },
  percent: {
    type: Number,
    default: 10
  }
})

module.exports = model('Partner', partner) 