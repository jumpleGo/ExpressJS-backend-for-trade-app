const MPair             = require('./../models/MPair')
const ccxws             = require("ccxws");
const addTradeToDb      = require('./addNewRecords')
const deleteOldRecords  = require('./deleteOldRecords')

async function subscribeForTrades () {
  /* Trade options */
  const options = await MPair.find()

  async function subscribeForTrade (market, binance) {
    let tradeData
    let tradeCandle
    await binance.subscribeTrades(market)
    await binance.subscribeCandles(market)

    await binance.on("candle", candle => tradeCandle = candle)
    await binance.on("trade", trade => tradeData = trade)
    
    await setInterval(async () => {
      if (tradeData) {
        await addTradeToDb(tradeData, 'line')
      }
      if (tradeCandle) {
        await addTradeToDb(tradeCandle, 'candle', market.id)
      }
    }, 2000)
  }

  options.forEach(async market => {
    let binance = new ccxws.Binance()
    await subscribeForTrade(market, binance)
  });
  await deleteOldRecords()
  setInterval (async () => {
    await deleteOldRecords()
  }, 60000)
}

module.exports = subscribeForTrades