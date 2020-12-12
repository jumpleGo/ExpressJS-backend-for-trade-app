const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MUser       = require('../../models/MUser')

router.post('/getPartnerByUser', async (req, res) => {
  let { userId } = req.body
 
  const referralObject = await MReferralConnection.findOne({referral: userId})
  console.log("🚀 ~ file: getPartnerByUser.js ~ line 10 ~ router.post ~ referralObject", referralObject)
  if (referralObject) {
    const { main } = referralObject
  
    if (main) {
      const partner = await MUser.findOne({_id: main})
      if (partner) {
        res.json(partner)
      } else {
        res.status(200).json('none')
      }
    } else {
      res.status(200).json()
    }
  }
})

module.exports = router
