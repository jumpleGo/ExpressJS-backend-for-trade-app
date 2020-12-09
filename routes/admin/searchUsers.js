const {Router}    = require('express')
const router      = Router()
const MUser       = require('../../models/MUser')
const MDeposit    = require('../../models/MDeposit')

router.post('/searchUsers', async (req, res) => {
  try {
    const {search} = req.body
    const users = await MUser.find({email: 
      {
        $regex: search
      }
    })  
    let promises = await users.map(async user => {
      const {_id} = user
      let deposits = await MDeposit.find({user: _id})
      user.deposits = deposits
      return await user
    })
      
    Promise.all(promises).then(updUsers => {
      res.json(updUsers)
    })
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
