const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')

router.post('/updateBalance',  async (req, res) => {
  try {
    const { email, amount, type, mode } = req.body

    const candidate = await MUser.findOne({ email })
    let balance = type === 'minus' 
      ? candidate[mode] - amount 
      : candidate[mode] + amount

    if (candidate) {
      await MUser.updateOne(
        { email }, 
        { $set : { [mode]: balance } }
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