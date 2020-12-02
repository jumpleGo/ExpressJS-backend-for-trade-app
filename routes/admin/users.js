const {Router}    = require('express')
const router      = Router()
const MUser       = require('../../models/MUser')

router.get('/users', async (req, res) => {
  try {
    const pairs = await MUser.find()
    res.json(pairs)
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
