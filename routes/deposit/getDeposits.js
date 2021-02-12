const {Router}    = require('express')
const router      = Router()
const MDeposit    = require('../../models/MDeposit')
const MUser       = require('../../models/MUser')

router.post('/getDeposits', async (req, res) => {
  try {
    const { userId } = req.body
    let deps
    if (userId) {
      deps = await MDeposit.find({user: userId})
    } else {
      const d = await MDeposit.find()
  
      let promises = await d.map(async dep => {
        console.log(dep.user)
        let userData = await MUser.findOne({_id: dep.user})
        dep.userData = userData
        return dep
      })

      Promise.all(promises).then(deps => res.json(deps))
      return
    }
    res.json(deps)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
