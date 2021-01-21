const {Router}    = require('express')
const router      = Router()
const MTrade       = require('../../models/MTrade')

router.post('/getChartData', async (req, res) => {
  try {
    let {base} = req.body
    const chartData = await MTrade.find({base})
    let cutsChartData = chartData.splice(0, chartData.length - 30)
    res.json(cutsChartData)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
