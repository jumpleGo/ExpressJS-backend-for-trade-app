const {Router}    = require('express')
const router      = Router()
const MReferralConnection   = require('../../models/MReferralConnection')
const MUser       = require('../../models/MUser')

router.get('/getPartners', async (req, res) => {
 
  try {
    const referralObjects = await MReferralConnection.find()
    let arrayOfPartnersPromises = referralObjects.forEach(obj => {
      let user = await MUser.findOne({_id: obj.main})
      return {
        user,
        ...obj,
      }
    })
  } catch (err) {
    console.log(err)
  }

})

module.exports = router
