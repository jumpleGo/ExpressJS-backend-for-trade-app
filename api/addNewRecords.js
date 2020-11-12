const MTrade        = require('./../models/MTrade')
const MCandle       = require('./../models/MCandle')

async function addTradeToDb (trade, type, base) {
  try {
    if (type === 'line') {
      const newTrade = new MTrade({...trade, date: +(new Date(trade.unix))})
      await newTrade.save()
    }
    if (type === 'candle') {
      const newTrade = new MCandle({...trade, base})
      await newTrade.save()
    }

  } catch (e) {
    console.log(e)
  }
}

module.exports = addTradeToDb;