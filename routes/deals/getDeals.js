const {Router}    = require('express')
const router      = Router()
const MDeal       = require('../../models/MDeal')

router.post('/getDeals', async (req, res) => {
  try {
    const { userId } = req.body
    const deals = await MDeal.find({user: userId}).sort({'_id': -1}).limit(10)

    res.json(deals)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
