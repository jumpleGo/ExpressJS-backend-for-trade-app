const {Router}    = require('express') 
const router      = Router()

const MWithd      = require('../../models/MWithd')
const MUser       = require('../../models/MUser')

router.post('/setWithdStatus',  async (req, res) => {
  try {
    const { id, status, user, amount} = req.body

    const w = await MWithd.findOne({ _id: id })

    if (w) {
      await MWithd.updateOne(
        { _id: id }, 
        { $set : { status, archived: true} }
      )
      console.log(status)
      if (status === 'REJECTED') {
        const candidate = await MUser.findOne({ _id: user })
        let balance = candidate.balance + amount

        if (candidate) {
          await MUser.updateOne(
            { _id: user }, 
            { $set : { balance } }
          )   
        }
      }
      res.json({ data: 'updated' })      
    } else {
      res.status(400).json({ error: 'user-not-found'})
    }
    
  } catch (e) {
    console.log(e)
  } 
})

module.exports = router