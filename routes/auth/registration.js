const {Router} = require('express') 
const router = Router()
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const {registerValidators} = require('./validators')
const User = require('../../models/user')

router.post('/register', registerValidators, async (req, res) => {
  try {
    const {email, password, name} = req.body
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        msg: errors.array()[0].msg
      })
    }

    const isAlrearyMember =  await User.findOne({ email: req.body.email })
    if (!isAlrearyMember) {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, password: hashPassword, name
      })
      await user.save()
      res.json({
        msg: "Created new User",
        status: 200
      })
    } else {
      res.status(422).json({
        error: 'Already registered'
      })
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router