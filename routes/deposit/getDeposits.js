const {Router}    = require('express')
const router      = Router()
const MDeposit      = require('../../models/MDeposit')

router.post('/getDeposits', async (req, res) => {
  try {
    const { userId } = req.body
    console.log("🚀 ~ file: getDeposits.js ~ line 8 ~ router.post ~ userId", userId)
    const d = await MDeposit.find({user: userId})
    console.log("🚀 ~ file: getDeposits.js ~ line 10 ~ router.post ~ d", d)

    res.json(d)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
