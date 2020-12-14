const {Router}    = require('express')
const router      = Router()
const MPromoCode  = require('../../models/MPromoCode')
var crypto        = require("crypto");

router.post('/createPromocodes', async (req, res) => {
    let {count, minDeposit, bonus} = req.body

    let codes = []
    for(let i = 0; i < count; i++) {
      let code = crypto.randomBytes(7).toString('hex');
      const promoObj = new MPromoCode({minDeposit, bonus, code})
      codes.push(promoObj)
    }

    let promises = codes.map(async (obj) => {
      return await obj.save()
    })

    Promise.all(promises).then(() => res.json('complete'))
})

module.exports = router
