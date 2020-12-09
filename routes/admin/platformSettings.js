const {Router}    = require('express')
const router      = Router()
const MSettings   = require('../../models/MSettings')

router.get('/platformSettings', async (req, res) => {
  try {
    const s = await MSettings.find()
    res.json(s)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
