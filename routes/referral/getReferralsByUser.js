const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MUser       = require('../../models/MUser')
const MDeposit    = require('../../models/MDeposit')

router.post('/getReferralsByUser', async (req, res) => {
  let { userId } = req.body
  
  const referralsArray = await MReferralConnection.find({main: userId})
    
  let promises = referralsArray.map(async ref => {
    let user = await MUser.findOne({_id: ref.referral})
    user.deposits = await MDeposit.find({user: user._id})
    return user
  })

  Promise.all(promises).then(users => res.json(users))
})

module.exports = router
