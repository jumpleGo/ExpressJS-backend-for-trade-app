const {Schema, model} = require('mongoose')

const ImageSchema = new Schema({
  type: String,
  data: Buffer
});

module.exports = model('VerifyImage', ImageSchema) 