const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MPartner    = require('../../models/MPartner')

router.post('/createReferralConnection', async (req, res) => {
  try {
    let { partner, user, date } = req.body

    const partnerModel = await MPartner.findOne({user: partner})
    if (!partnerModel) {
      const partnerObj = new MPartner({
        user: partner
      })
      await partnerObj.save()
    }
    
    const refObj = new MReferralConnection({
      main: partner, referral: user, date
    })
    
    await refObj.save()
    res.json(refObj)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
