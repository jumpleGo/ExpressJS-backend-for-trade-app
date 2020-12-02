const {Router}    = require('express') 
const router      = Router()
const MUser       = require('../../models/MUser')

router.post('/checkAuth',  async (req, res) => {
  try {
    const candidate = await MUser.findOne({ email: req.body.email })
    
    if (candidate) {
      res.json({
        user: candidate
      })      
    } else {
      res.status(400).json({ error: 'user-not-found'})
    }
    
  } catch (e) {
    console.log(e)
  } 
})

module.exports = router