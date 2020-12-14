const {Router}    = require('express')
const router      = Router()
const MPartner    = require('../../models/MPartner')

router.post('/setPercentToPartner', async (req, res) => {
  try {
    const { id, percent } = req.body
    
    const p = await MPartner.find({_id: id})
    
    if (p) {
      await MPartner.updateOne(
        { _id: id }, 
        { $set : { percent } }
      )
      res.json({ data: 'updated' }) 
    }
  } catch (err) {
    res.status(400).json(err)
  }
})
   
    
    

module.exports = router