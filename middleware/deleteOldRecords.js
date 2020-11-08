const MTrade        = require('./../models/MTrade')

async function deleteOldRecords () {
  try {
    // TODO create a filter for calculate diff for a dates
    const trades = await MTrade.find().exec()
    if (trades.length) {
      trades.length = (trades.length / 2).toFixed()

      for (let i = 0; i < trades.length - 1; i++) {
        if((new Date() - new Date(trades[i].date)) / (1000 * 60).toFixed(1) > 15) {
          await MTrade.findByIdAndDelete(trades[i]._id)
        }
      }
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = deleteOldRecords;