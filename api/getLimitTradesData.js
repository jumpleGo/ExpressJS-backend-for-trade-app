const MCandle       = require('./../models/MCandle')
const MTrade       = require('./../models/MTrade')

async function getLimitTradesData (base) {
  const lineData = await MTrade.find({base}).sort({'_id': -1}).limit(30)
  const candleData = await MCandle.find({base}).sort({'_id': -1}).limit(30)
  
  return {lineData: lineData.reverse(), candleData: candleData.reverse()}
}
  
module.exports = getLimitTradesData