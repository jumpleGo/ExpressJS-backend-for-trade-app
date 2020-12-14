const {Router}    = require('express')
const router      = Router()
const MPartner    = require('../../models/MPartner')
const MUser       = require('../../models/MUser')
const MReferralConnection   = require('../../models/MReferralConnection')

router.get('/getPartners', async (req, res) => {
  
  const partners = await MPartner.find()
  
  let promises = partners.map(async p => {
    return {
      _id: p._id,
      referralCount: await MReferralConnection.countDocuments({main: p.user}),
      userObject: await MUser.findOne({_id: p.user}),
      percent: p.percent
    }
  })

  Promise.all(promises).then(partners => res.json(partners))
})

module.exports = router
