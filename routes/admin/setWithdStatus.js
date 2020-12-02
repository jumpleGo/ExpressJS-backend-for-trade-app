const {Router}    = require('express') 
const router      = Router()
const MWithd      = require('../../models/MWithd')

router.post('/setWithdStatus',  async (req, res) => {
  try {
    const { id, status} = req.body

    const w = await MWithd.findOne({ _id: id })

    if (w) {
      await MWithd.updateOne(
        { _id: id }, 
        { $set : { status} }
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