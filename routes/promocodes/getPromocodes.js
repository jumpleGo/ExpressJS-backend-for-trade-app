const {Router}    = require('express')
const router      = Router()
const MPromoCode  = require('../../models/MPromoCode')

router.get('/getPromocodes', async (req, res) => {
 
  try {
    const proocodes = await MPromoCode.find()
    res.json(proocodes.reverse())
  } catch (err) {
    console.log(err)
  }

})

module.exports = router
