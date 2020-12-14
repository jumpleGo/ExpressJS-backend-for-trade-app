const {Schema, model} = require('mongoose')

const partner = new Schema({
  user: {
    type: String,
    required: true
  },
  userObject: {
    type: Object,
    default: {}
  },
  percent: {
    type: Number,
    default: 10
  }
})

module.exports = model('Partner', partner) 