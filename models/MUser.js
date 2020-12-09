const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  withdrawalBlocked: {
    type: Boolean,
    default: false
  },
  deposits: {
    type: Array,
    required: false
  }
})

module.exports = model('User', userSchema) 