const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')

router.post('/setUsersSettings',  async (req, res) => {
  try {
    const { email, object} = req.body

    const candidate = await MUser.findOne({ email })

    if (candidate) {
      await MUser.updateOne(
        { email }, 
        { $set : { ...object} }
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