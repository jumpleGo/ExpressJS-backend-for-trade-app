const {Schema, model} = require('mongoose')

const verifySchema = new Schema({
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  files: {
    type: Array,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  userObject: {
    type: Object,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    default: false
  }
})

module.exports = model('VerifyRequest', verifySchema) 