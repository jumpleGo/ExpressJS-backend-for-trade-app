const {Router}    = require('express')
const router      = Router()
const MPromoCode  = require('../../models/MPromoCode')

router.get('/getPromocodes', async (req, res) => {
 
  try {
    const promocodes = await MPromoCode.find()
    res.json(promocodes.reverse())
  } catch (err) {
    console.log(err)
  }

})

module.exports = router
