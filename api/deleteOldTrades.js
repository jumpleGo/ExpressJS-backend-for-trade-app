const MTrade        = require('../models/MTrade')

async function deleteOldTrades () {
  try {
    // TODO create a filter for calculate diff for a dates
    const trades = await MTrade.find().exec()

    if (trades.length) {
      for (let i = 0; i < trades.length - 1; i++) {
        if((new Date() - new Date(trades[i].date)) / (1000 * 60).toFixed(1) > 45) {
          await MTrade.findByIdAndDelete(trades[i]._id)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = deleteOldTrades;