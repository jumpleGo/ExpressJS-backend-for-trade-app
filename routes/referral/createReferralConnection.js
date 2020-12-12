const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MPartner    = require('../../models/MPartner')

router.post('/createReferralConnection', async (req, res) => {
  try {
    let { ref, user, date } = req.body

    const partner = await MPartner.findOne({user: ref})
    if (!partner) {
      const partnerObj = new MPartner({
        user: ref
      })
      await partnerObj.save()
    }
    
    const refObj = new MReferralConnection({
      main: ref, referral: user, date
    })
    
    await refObj.save()
    res.json(refObj)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
