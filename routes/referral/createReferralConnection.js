const {Router}    = require('express')
const router      = Router()
const MReferral     = require('../../models/MReferral')

router.post('/createReferalConnection', async (req, res) => {
  try {
    let { ref, user } = req.body
    const refObj = new MReferral({
      main: ref, referal: user
    })
    await refObj.save()
    res.json(refObj)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
