const MPair             = require('./../models/MPair')
const ccxws             = require("ccxws");
const addTradeToDb      = require('./addNewRecords')
const deleteOldTrades   = require('./deleteOldTrades')
const deleteOldCandles  = require('./deleteOldCandles')

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
  await deleteOldTrades()
  await deleteOldCandles()
  setInterval (async () => {
    await deleteOldTrades()
    await deleteOldCandles()
  }, 180000)
}

module.exports = subscribeForTrades