const {Router}    = require('express')
const router      = Router()
const MWithd      = require('../../models/MWithd')
const MUser       = require('../../models/MUser')

router.get('/withdrawals', async (req, res) => {
  try {
    const w = await MWithd.find()
    let promises = await w.map(async w => {
      w.userObject = await MUser.find({_id: w.user})
      return w
    })
      
    Promise.all(promises).then(objects => {
      res.json(objects)
    })
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
