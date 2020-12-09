const {Router}    = require('express')
const router      = Router()
const MSettings   = require('../../models/MSettings')

router.post('/setNewSettings', async (req, res) => {
  try {
    const { value, id } = req.body
    
    const s = await MSettings.find({_id: id})
    console.log("🚀 ~ file: setNewSettings.js ~ line 10 ~ router.post ~  s",  s)
    await MSettings.updateOne(
      { _id: id }, 
      { $set : { ...value } }
    )
    res.json({ data: 'updated' }) 
  } catch (err) {
    res.status(400).json(err)
  }
})
   
    
    

module.exports = router