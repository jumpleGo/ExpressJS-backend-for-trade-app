const MCandle       = require('../models/MCandle')

async function deleteOldCandles () {
  try {
    // TODO create a filter for calculate diff for a dates

    const candleTrades = await MCandle.find().exec()

    if (candleTrades.length) {
      for (let i = 0; i < candleTrades.length - 1; i++) {
        if((new Date() - new Date(candleTrades[i].timestampMs)) / (1000 * 60).toFixed(1) > 45) {
          await MCandle.findByIdAndDelete(candleTrades[i]._id)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = deleteOldCandles;