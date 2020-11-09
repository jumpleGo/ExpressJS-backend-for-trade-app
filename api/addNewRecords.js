const MTrade        = require('./../models/MTrade')

async function addTradeToDb (trade) {
  try {
    const newTrade = new MTrade({...trade, date: +(new Date(trade.unix))})
    await newTrade.save()

  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = addTradeToDb;