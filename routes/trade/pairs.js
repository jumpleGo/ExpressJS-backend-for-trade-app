const {Router}    = require('express')
const router      = Router()
const MPair       = require('../../models/MPair')

router.get('/pairs', async (req, res) => {
  try {
    const pairs = await MPair.find()
    res.json(pairs)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
