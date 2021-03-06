const {Router}    = require('express')
const router      = Router()
const MUser       = require('../../models/MUser')
const MDeposit    = require('../../models/MDeposit')

router.get('/users', async (req, res) => {
  try {
    const users = await MUser.find()
    let promises = await users.map(async user => {
      const {_id} = user
      user.deposits = await MDeposit.find({user: _id})
      return user
    })
      
    Promise.all(promises).then(updUsers => {
      res.json(updUsers)
    })
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
