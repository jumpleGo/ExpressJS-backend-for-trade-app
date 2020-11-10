const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')

router.post('/updateBalance',  async (req, res) => {
  try {
    const { email, amount, type } = req.body

    const candidate = await MUser.findOne({ email })
    let balance = type === 'minus' 
      ? candidate.balance - amount 
      : candidate.balance + amount

    if (candidate) {
      await MUser.updateOne(
        { email }, 
        { $set : { balance } }
      )
      res.json({ data: 'updated' })      
    } else {
      res.status(400).json({ error: 'user-not-found'})
    }
    
  } catch (e) {
    console.log(e)
  } 
})

module.exports = router