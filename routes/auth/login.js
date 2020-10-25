const {Router} = require('express') 
const router = Router()
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')
const {loginValidators} = require('./validators')
const keys = require('../../keys')
const User = require('../../models/user')

router.post('/login', loginValidators, async (req, res) => {
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      msg: errors.array()[0].msg
    })
  }

  try {
    const user = {
      user: req.body.email,
    }

    const candidate = await User.findOne({ email: req.body.email })
    const { name, email } = candidate
    
    const token = jwt.sign(user, keys.JWT_SECRET, { 
      expiresIn: '5d'
    })
    
    res.json({
      token,
      user: { name, email } 
    })

  } catch (e) {
    console.log(e)
  } 
})

module.exports = router