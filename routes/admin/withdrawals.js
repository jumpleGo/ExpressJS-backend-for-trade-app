const {Router}    = require('express')
const router      = Router()
const MWithd      = require('../../models/MWithd')

router.get('/withdrawals', async (req, res) => {
  try {
    const w = await MWithd.find()
    res.json(w)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
