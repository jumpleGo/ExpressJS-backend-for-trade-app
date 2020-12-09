const {Router}              = require('express')
const router                = Router()
const MVerifyRequest        = require('../../models/MVerifyRequest')
const MUser                 = require('../../models/MUser')

router.post('/getVerifyRequest', async (req, res) => {
  try {
    let {user} = req.body
    if (user) {
      let vrequests = await MVerifyRequest.find({user}).sort({_id: -1}).limit(1)
      res.json(vrequests)
    } else {
      let requests = await MVerifyRequest.find()

      let promises = await requests.map(async v => {
        v.userObject = await MUser.findOne({_id: v.user})
        return v
      })
      Promise.all(promises).then(objects => {
        console.log("🚀 ~ file: getVerifyRequest.js ~ line 20 ~ Promise.all ~ objects", objects)
        res.json(objects)
      })
    }
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
