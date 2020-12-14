const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MUser       = require('../../models/MUser')

router.post('/getReferralsByUser', async (req, res) => {
  let { userId } = req.body
  
  const referralsArray = await MReferralConnection.find({main: userId})
  
  let promises = referralsArray.map(async ref => {
    return await MUser.findOne({_id: ref.referral})
  })

  Promise.all(promises).then(users => res.json(users))
})

module.exports = router
