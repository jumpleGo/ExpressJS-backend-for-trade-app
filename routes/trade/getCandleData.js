const {Router}    = require('express')
const router      = Router()
const MCandle       = require('../../models/MCandle')

router.post('/getCandleData', async (req, res) => {
  try {
    let {base} = req.body
    const chartData = await MCandle.find({base})
    res.json(chartData)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
