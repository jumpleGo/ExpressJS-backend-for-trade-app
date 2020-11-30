const {Router}              = require('express')
const router                = Router()
const MVerifyRequest        = require('../../models/MVerifyRequest')

router.post('/getVerifyRequest', async (req, res) => {
  try {
    let {user} = req.body
    const request = await MVerifyRequest.find({user})
    res.json(request)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
