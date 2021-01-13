const {Router}    = require('express')
const router      = Router()
const MPromoCode  = require('../../models/MPromoCode')

router.post('/deactivatePromocode', async (req, res) => {
    let {id} = req.body
    console.log("🚀 ~ file: deactivatePromocode.js ~ line 7 ~ router.post ~ id", id)

    try {
      const promo = await MPromoCode.find({_id: id})
      console.log("🚀 ~ file: deactivatePromocode.js ~ line 11 ~ router.post ~ promo", promo)
      if (promo) {
        await MPromoCode.findByIdAndDelete(id)
        res.status(200).json('updated')
			} else {
				res.json('not-found')
			}
    } catch (err) {
      console.log(err)
    }
})

module.exports = router
