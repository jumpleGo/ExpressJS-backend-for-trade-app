const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')

router.post('/merchant',  async (req, res) => {
  try {
    const { payment_info, amount } = req.body
    console.log("req.body", req.body)

    const candidate = await MUser.findOne({ _id: payment_info })
    let balance = candidate.balance + amount

    if (candidate) {
      await MUser.updateOne(
        { email }, 
        { $set : { balance } }
      )
      res.json({ data: balance })      
    } else {
      res.status(400).json({ error: 'user-not-found'})
    }
    
  } catch (e) {
    console.log(e)
  } 
})

module.exports = router