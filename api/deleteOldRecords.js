const MTrade        = require('./../models/MTrade')
const MCandle       = require('./../models/MCandle')

async function deleteOldRecords () {
  try {
    // TODO create a filter for calculate diff for a dates
    const trades = await MTrade.find().exec()
    const candleTrades = await MCandle.find().exec()

    if (trades.length) {
      for (let i = 0; i < trades.length - 1; i++) {
        if((new Date() - new Date(trades[i].date)) / (1000 * 60).toFixed(1) > 15) {
          await MTrade.findByIdAndDelete(trades[i]._id)
        }
      }
    }

    if (candleTrades.length) {
      for (let i = 0; i < candleTrades.length - 1; i++) {
        if((new Date() - new Date(candleTrades[i].date)) / (1000 * 60).toFixed(1) > 15) {
          await MCandle.findByIdAndDelete(candleTrades[i]._id)
        }
      }
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = deleteOldRecords;