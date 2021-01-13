const {Router}    = require('express')
const router      = Router()
const MPromoCode  = require('../../models/MPromoCode')

router.post('/checkPromocode', async (req, res) => {
    let {promocode} = req.body

    try {
      const promo = await MPromoCode.find({code: promocode})
      if (promo) {
				res.json(promo)
			} else {
				res.json({})
			}
    } catch (err) {
      console.log(err)
    }
})

module.exports = router
