const {Router}    = require('express') 
const router      = Router()
const bcrypt      = require('bcryptjs')
const MUser        = require('../../models/MUser')

router.post('/register', async (req, res) => {
  try {
    const {email, password, name} = req.body
  
    const isAlrearyMember =  await MUser.findOne({ email: req.body.email })
    if (!isAlrearyMember) {
      const hashPassword = await bcrypt.hash(password, 10)

      const user = new MUser({
        email, password: hashPassword, name
      })
      await user.save()

      res.json({
        msg: "Created new User",
        status: 200,
        user
      })

    } else {
      res.status(404).json({
        status: 400,
        error: 'Already registered'
      })
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router