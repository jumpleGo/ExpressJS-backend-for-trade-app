const {Router}    = require('express')
const router      = Router()
const MWithd      = require('../../models/MWithd')

router.post('/getWithdrawals', async (req, res) => {
  try {
    const { userId } = req.body
    const w = await MWithd.find({user: userId})

    res.json(w)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
