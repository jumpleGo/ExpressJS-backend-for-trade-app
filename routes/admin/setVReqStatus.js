const {Router}    = require('express') 
const router      = Router()

const MVerifyRequest     = require('../../models/MVerifyRequest')
const MUser              = require('../../models/MUser')

router.post('/setVerifyStatus',  async (req, res) => {
  try {
    const { id, status, user } = req.body
    const v = await MVerifyRequest.find({ _id: id })

    if (v) {
      await MVerifyRequest.updateOne(
        { _id: id }, 
        { $set : { status, archived: true} }
      )

      if (status === 'ACCEPTED') {
        await MUser.updateOne(
          { _id: user }, 
          { $set : { isVerified: true } }
        )
      }

      if (status === 'REJECTED') {
        await MUser.updateOne(
          { _id: user }, 
          { $set : { isVerified: false } }
        )
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