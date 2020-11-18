const {Router}    = require('express')
const router      = Router()
const MWithd       = require('../../models/MWithd')

router.post('/createWithdrawal', async (req, res) => {
  try {
    const { amount, userId, date, status, card } = req.body

    const withdrawal = new MWithd({
      user: userId,
      amount,
      date,
      status,
      card
    })
    
    const wObject = await withdrawal.save()
    res.json(wObject)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
